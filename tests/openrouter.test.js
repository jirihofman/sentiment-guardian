import { afterEach, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { getOpenRouter, requestBatch } from '../lib/openrouter.js';
import { MODEL_GPT_SENTIMENT, MODEL_GPT_COMMENTS, MODEL_GPT_POI, MODEL_SPEECH } from '../lib/const.js';

const originalKey = process.env.OPENROUTER_API_KEY;
afterEach(() => {
    mock.restoreAll();
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
});

test('requires OpenRouter credentials even when an OpenAI key is present', () => {
    delete process.env.OPENROUTER_API_KEY;
    assert.throws(() => getOpenRouter(), /OPENROUTER_API_KEY/);
});

for (const model of new Set([MODEL_GPT_SENTIMENT, MODEL_GPT_COMMENTS, MODEL_GPT_POI])) test(`sends ${model} chat requests to OpenRouter`, async () => {
    process.env.OPENROUTER_API_KEY = 'test-router-key';
    const fetchMock = mock.method(globalThis, 'fetch', async () => (new Response(JSON.stringify({
        choices: [{ message: { content: '75' } }],
    }), { headers: { 'Content-Type': 'application/json' } })));
    const response = await getOpenRouter().chat.completions.create({ model, messages: [{ role: 'user', content: 'A headline' }] });
    const [url, options] = fetchMock.mock.calls[0].arguments;
    assert.equal(String(url), 'https://openrouter.ai/api/v1/chat/completions');
    assert.equal(new Headers(options.headers).get('authorization'), 'Bearer test-router-key');
    assert.equal(JSON.parse(options.body).model, model);
    assert.equal(response.choices[0].message.content, '75');
});

test('speech returns audio bytes through the OpenRouter speech endpoint', async () => {
    process.env.OPENROUTER_API_KEY = 'test-router-key';
    const fetchMock = mock.method(globalThis, 'fetch', async () => (new Response(new Uint8Array([73, 68, 51]), {
        headers: { 'Content-Type': 'audio/mpeg' },
    })));
    const response = await getOpenRouter().audio.speech.create({ model: MODEL_SPEECH, input: 'Headlines', voice: 'alloy', response_format: 'mp3' });
    assert.equal(String(fetchMock.mock.calls[0].arguments[0]), 'https://openrouter.ai/api/v1/audio/speech');
    assert.equal(JSON.parse(fetchMock.mock.calls[0].arguments[1].body).response_format, 'mp3');
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), new Uint8Array([73, 68, 51]));
});

test('submits inline batch requests and retrieves inline results', async () => {
    process.env.OPENROUTER_API_KEY = 'test-router-key';
    const responses = [
        new Response(JSON.stringify({ id: 'batch_123', status: 'validating' }), { status: 202 }),
        new Response(JSON.stringify({ status: 'completed', results: [{ custom_id: 'poi-2026-08' }] })),
    ];
    const fetchMock = mock.method(globalThis, 'fetch', async () => responses.shift());
    const body = { endpoint: '/v1/chat/completions', model: MODEL_GPT_POI, requests: [{ custom_id: 'poi-2026-08', body: { messages: [] } }] };
    assert.deepEqual(await requestBatch('', body), { id: 'batch_123', status: 'validating' });
    assert.equal(fetchMock.mock.calls[0].arguments[0], 'https://openrouter.ai/api/beta/batches');
    assert.deepEqual(JSON.parse(fetchMock.mock.calls[0].arguments[1].body), body);
    assert.deepEqual(await requestBatch('/batch_123'), { status: 'completed', results: [{ custom_id: 'poi-2026-08' }] });
    assert.equal(fetchMock.mock.calls[1].arguments[1].method, 'GET');
});

test('batch failures surface without leaking credentials', async () => {
    process.env.OPENROUTER_API_KEY = 'test-router-key';
    mock.method(globalThis, 'fetch', async () => (new Response('Unauthorized', { status: 401 })));
    await assert.rejects(requestBatch('/batch_123'), /OpenRouter batch request failed \(401\)/);
});
