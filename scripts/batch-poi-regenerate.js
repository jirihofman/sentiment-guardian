/**
 * Script to regenerate all monthly POI data using OpenRouter Batch API
 * 
 * This script:
 * 1. Fetches all articles from Redis grouped by month
 * 2. Creates batch requests for each month
 * 3. Submits them to OpenRouter Batch API
 * 4. Retrieves results and stores them back in Redis
 * 
 * Usage:
 *   node --env-file=.env.local scripts/batch-poi-regenerate.js --prepare   # Prepare batch file
 *   node --env-file=.env.local scripts/batch-poi-regenerate.js --submit    # Submit batch to OpenRouter
 *   node --env-file=.env.local scripts/batch-poi-regenerate.js --status    # Check batch status
 *   node --env-file=.env.local scripts/batch-poi-regenerate.js --retrieve  # Retrieve and store results
 *   node --env-file=.env.local scripts/batch-poi-regenerate.js --single 2024-12  # Test single month (no batch)
 */

import { Redis } from '@upstash/redis';
import { getOpenRouter, requestBatch } from '../lib/openrouter.js';
import { MODEL_GPT_POI } from '../lib/const.js';
import fs from 'fs';
import path from 'path';

const BATCH_FILE_PATH = path.join(process.cwd(), 'scripts', 'poi-openrouter-batch-input.jsonl');
const BATCH_ID_FILE = path.join(process.cwd(), 'scripts', 'poi-openrouter-batch-id.txt');
const BATCH_OUTPUT_PATH = path.join(process.cwd(), 'scripts', 'poi-openrouter-batch-output.jsonl');

const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
});

/**
 * Parse a score like "20241201120000.000" into a Date
 */
function parseScoreToDate(score) {
    const scoreStr = String(score).split('.')[0];
    const year = parseInt(scoreStr.substring(0, 4));
    const month = parseInt(scoreStr.substring(4, 6));
    const day = parseInt(scoreStr.substring(6, 8));
    return new Date(year, month - 1, day);
}

/**
 * Convert a Date to a score string for ZRANGEBYSCORE
 */
function dateToScore(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}000000`;
}

/**
 * Get all articles grouped by month
 */
async function getArticlesByMonth() {
    console.log('Fetching all articles from Redis...');
    
    // Get all articles with their scores
    const articlesWithScores = await redis.zrange('article:guardian', 0, -1, { 
        rev: true, 
        withScores: true 
    });

    // Group by year-month
    const byMonth = {};
    
    for (let i = 0; i < articlesWithScores.length; i += 2) {
        const article = articlesWithScores[i];
        const score = articlesWithScores[i + 1];
        
        const date = parseScoreToDate(score);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!byMonth[yearMonth]) {
            byMonth[yearMonth] = [];
        }
        
        byMonth[yearMonth].push({
            title: article.title,
            date: article.date,
            score
        });
    }

    console.log(`Found ${Object.keys(byMonth).length} months with articles`);
    for (const [month, articles] of Object.entries(byMonth)) {
        console.log(`  ${month}: ${articles.length} articles`);
    }

    return byMonth;
}

/**
 * Create the POI prompt for a month's articles
 */
function createPoiPrompt(articles) {
    return {
        model: MODEL_GPT_POI,
        reasoning: { effort: 'low' },
        messages: [
            { 
                role: 'system', 
                content: 'Analyze the following article headlines from The Guardian and identify the 3 persons (individuals, not organizations) that appear most frequently or are the main subject of coverage. Return exactly 3 names, comma-separated.' 
            },
            { 
                role: 'user', 
                content: `Article headlines:\n${articles.map(a => `- ${a.title}`).join('\n')}` 
            },
        ],
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'persons-of-interest',
                strict: true,
                description: 'The 3 persons The Guardian focused on most in this period.',
                schema: {
                    type: 'object',
                    properties: {
                        persons: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of exactly 3 person names'
                        },
                        reasoning: {
                            type: 'string',
                            description: 'Brief explanation of why these persons were selected'
                        }
                    },
                    required: ['persons', 'reasoning'],
                    additionalProperties: false,
                }
            }
        }
    };
}

/**
 * Prepare batch file for OpenRouter Batch API
 */
async function prepareBatch() {
    const articlesByMonth = await getArticlesByMonth();
    
    const batchRequests = [];
    
    for (const [yearMonth, articles] of Object.entries(articlesByMonth)) {
        if (articles.length < 5) {
            console.log(`Skipping ${yearMonth} - only ${articles.length} articles`);
            continue;
        }

        const request = {
            custom_id: `poi-${yearMonth}`,
            method: 'POST',
            url: '/v1/chat/completions',
            body: createPoiPrompt(articles)
        };
        
        batchRequests.push(JSON.stringify(request));
    }

    fs.writeFileSync(BATCH_FILE_PATH, batchRequests.join('\n'));
    console.log(`\nBatch file created: ${BATCH_FILE_PATH}`);
    console.log(`Total requests: ${batchRequests.length}`);
    console.log('\nNext step: Run with --submit to submit the batch to OpenRouter');
}

/**
 * Submit batch to OpenRouter
 */
async function submitBatch() {
    if (!fs.existsSync(BATCH_FILE_PATH)) {
        console.error('Batch file not found. Run --prepare first.');
        process.exit(1);
    }

    const requests = fs.readFileSync(BATCH_FILE_PATH, 'utf-8').split('\n')
        .filter(line => line.trim()).map(line => {
            const { custom_id, body } = JSON.parse(line);
            return { custom_id, body };
        });
    if (!requests.length) throw new Error('Batch input is empty. Run --prepare first.');
    if (requests.some(request => request.body.model !== MODEL_GPT_POI)) {
        throw new Error('Batch input uses an old model. Run --prepare again.');
    }
    console.log('Submitting batch to OpenRouter...');
    const batch = await requestBatch('', {
        endpoint: '/v1/chat/completions',
        model: MODEL_GPT_POI,
        requests,
    });

    fs.writeFileSync(BATCH_ID_FILE, batch.id);
    console.log(`\nBatch created: ${batch.id}`);
    console.log(`Status: ${batch.status}`);
    console.log('\nBatch ID saved to:', BATCH_ID_FILE);
    console.log('\nNext step: Run with --status to check batch status');
}

/**
 * Check batch status
 */
async function checkStatus() {
    if (!fs.existsSync(BATCH_ID_FILE)) {
        console.error('Batch ID file not found. Run --submit first.');
        process.exit(1);
    }

    const batchId = fs.readFileSync(BATCH_ID_FILE, 'utf-8').trim();
    const batch = await requestBatch(`/${encodeURIComponent(batchId)}`);

    console.log(`Batch ID: ${batch.id}`);
    console.log(`Status: ${batch.status}`);
    console.log(`Created: ${new Date(batch.created_at * 1000).toISOString()}`);
    console.log(`Requests: ${batch.request_counts.total}`);
    console.log(`  Completed: ${batch.request_counts.completed}`);
    console.log(`  Failed: ${batch.request_counts.failed}`);

    if (batch.status === 'completed') {
        console.log(`\nResults available: ${batch.results?.length ?? 0}`);
        console.log('\nNext step: Run with --retrieve to download and store results');
    } else if (batch.status === 'failed') {
        console.log('\nBatch failed!');
        if (batch.error) {
            console.log('Errors:', JSON.stringify(batch.error, null, 2));
        }
    } else {
        console.log('\nBatch is still processing. Check again later.');
    }
}

/**
 * Retrieve batch results and store in Redis
 */
async function retrieveAndStore() {
    if (!fs.existsSync(BATCH_ID_FILE)) {
        console.error('Batch ID file not found. Run --submit first.');
        process.exit(1);
    }

    const batchId = fs.readFileSync(BATCH_ID_FILE, 'utf-8').trim();
    const batch = await requestBatch(`/${encodeURIComponent(batchId)}`);

    if (batch.status !== 'completed') {
        console.error(`Batch status is "${batch.status}", not "completed". Wait for completion.`);
        process.exit(1);
    }

    if (!Array.isArray(batch.results)) throw new Error('Completed batch has no results');
    const lines = batch.results.map(result => JSON.stringify(result));
    fs.writeFileSync(BATCH_OUTPUT_PATH, lines.join('\n'));
    console.log(`Output saved to: ${BATCH_OUTPUT_PATH}`);

    let successCount = 0;
    let errorCount = 0;

    for (const line of lines) {
        const result = JSON.parse(line);
        const yearMonth = result.custom_id.replace('poi-', '');
        
        if (result.error) {
            console.error(`Error for ${yearMonth}:`, result.error);
            errorCount++;
            continue;
        }

        try {
            const content = JSON.parse(result.response.body.choices[0].message.content);
            const persons = content.persons;
            
            const key = `ai-persons-of-interest-monthly:${yearMonth}`;
            await redis.set(key, JSON.stringify(persons));
            console.log(`✓ Stored ${yearMonth}: ${persons.join(', ')}`);
            successCount++;
        } catch (err) {
            console.error(`Failed to parse/store ${yearMonth}:`, err.message);
            errorCount++;
        }
    }

    console.log(`\nDone! Success: ${successCount}, Errors: ${errorCount}`);
}

/**
 * Test a single month without batching (for validation)
 */
async function testSingleMonth(yearMonth) {
    console.log(`Testing POI generation for ${yearMonth}...`);
    
    const [year, month] = yearMonth.split('-').map(Number);
    
    // Calculate score range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
    
    const scoreStart = dateToScore(startDate);
    const scoreEnd = dateToScore(endDate) + '999999'; // End of last day

    console.log(`Score range: ${scoreStart} - ${scoreEnd}`);

    // Get articles in range using zrange with BYSCORE
    const articles = await redis.zrange('article:guardian', scoreStart, scoreEnd, { byScore: true });
    
    if (!articles.length) {
        console.log('No articles found for this month');
        return;
    }

    console.log(`Found ${articles.length} articles:`);
    articles.forEach(a => console.log(`  - ${a.title}`));

    // Call OpenRouter directly (not batch)
    console.log('\nCalling OpenRouter...');
    const prompt = createPoiPrompt(articles.map(a => ({ title: a.title })));
    const result = await getOpenRouter().chat.completions.create(prompt);
    
    const content = JSON.parse(result.choices[0].message.content);
    console.log('\nResult:');
    console.log('Persons:', content.persons);
    console.log('Reasoning:', content.reasoning);

    // Store in Redis
    const key = `ai-persons-of-interest-monthly:${yearMonth}`;
    await redis.set(key, JSON.stringify(content.persons));
    console.log(`\n✓ Stored to Redis key: ${key}`);
}

/**
 * List existing POI data in Redis
 */
async function listExisting() {
    const keys = await redis.keys('ai-persons-of-interest-monthly:*');
    
    if (!keys.length) {
        console.log('No existing POI data found');
        return;
    }

    console.log('Existing POI data:');
    for (const key of keys.sort()) {
        const data = await redis.get(key);
        const yearMonth = key.replace('ai-persons-of-interest-monthly:', '');
        // Handle both JSON array and comma-separated string formats
        let persons;
        try {
            persons = typeof data === 'string' && data.startsWith('[') 
                ? JSON.parse(data) 
                : (Array.isArray(data) ? data : data.split(',').map(p => p.trim()));
        } catch {
            persons = data.split(',').map(p => p.trim());
        }
        console.log(`  ${yearMonth}: ${persons.join(', ')}`);
    }
}

/**
 * Delete all existing POI data (before regeneration)
 */
async function deleteAll() {
    const keys = await redis.keys('ai-persons-of-interest-monthly:*');
    
    if (!keys.length) {
        console.log('No existing POI data to delete');
        return;
    }

    console.log(`Deleting ${keys.length} POI keys...`);
    for (const key of keys) {
        await redis.del(key);
        console.log(`  Deleted: ${key}`);
    }
    console.log('Done!');
}

// Main CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case '--prepare':
        await prepareBatch();
        break;
    case '--submit':
        await submitBatch();
        break;
    case '--status':
        await checkStatus();
        break;
    case '--retrieve':
        await retrieveAndStore();
        break;
    case '--single':
        if (!args[1]) {
            console.error('Please provide a year-month, e.g., --single 2024-12');
            process.exit(1);
        }
        await testSingleMonth(args[1]);
        break;
    case '--list':
        await listExisting();
        break;
    case '--delete-all':
        await deleteAll();
        break;
    default:
        console.log(`
POI Monthly Batch Regeneration Script

Usage:
  node scripts/batch-poi-regenerate.js <command>

Commands:
  --prepare     Fetch articles and create batch input file
  --submit      Submit prepared requests to OpenRouter
  --status      Check batch processing status
  --retrieve    Download results and store in Redis
  --single MM   Test single month (e.g., --single 2024-12)
  --list        List existing POI data in Redis
  --delete-all  Delete all existing POI data

Workflow:
  1. --list (optional) to see current data
  2. --delete-all (optional) to clear existing data
  3. --prepare to create batch file
  4. --submit to send to OpenRouter
  5. --status to monitor progress
  6. --retrieve to store results

For testing, use --single to process one month without batching.
        `);
}
