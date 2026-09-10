import OpenAI from 'openai';

// Construct on demand so read-only routes and builds do not require an AI key.
export function getOpenRouter() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured');
    return new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
    });
}

// OpenRouter batches use inline requests/results and a separate beta endpoint.
export async function requestBatch(path = '', body) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured');
    const response = await fetch(`https://openrouter.ai/api/beta/batches${path}`, {
        method: body ? 'POST' : 'GET',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) throw new Error(`OpenRouter batch request failed (${response.status})`);
    return response.json();
}
