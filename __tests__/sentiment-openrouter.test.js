import { jest, test, expect, beforeEach, afterAll } from '@jest/globals';

const redis = { zrange: jest.fn(), zrem: jest.fn(), zadd: jest.fn(), incr: jest.fn() };
const create = jest.fn();
jest.unstable_mockModule('@upstash/redis', () => ({ Redis: class { constructor() { return redis; } } }));
jest.unstable_mockModule('../lib/openrouter.js', () => ({ getOpenRouter: () => ({ chat: { completions: { create } } }) }));
const { POST } = await import('../app/api/sentiment/route.js');
const originalAdminKey = process.env.ADMIN_API_KEY;
const originalRouterKey = process.env.OPENROUTER_API_KEY;
const req = () => ({ json: async () => ({ adminApiKey: 'test-admin' }) });
beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_API_KEY = 'test-admin';
    process.env.OPENROUTER_API_KEY = 'test-router';
    redis.zrange.mockResolvedValue([{ title: 'Peace agreement reached', date: '2026-09-10T12:00:00.000Z' }]);
});
afterAll(() => {
    for (const [key, value] of [['ADMIN_API_KEY', originalAdminKey], ['OPENROUTER_API_KEY', originalRouterKey]]) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
});
test('uses Luna and stores a valid score', async () => {
    create.mockResolvedValue({ choices: [{ message: { content: ' 85 ' } }] });
    expect((await POST(req())).status).toBe(200);
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ model: 'openai/gpt-5.6-luna', service_tier: 'flex', reasoning: { effort: 'none' } }));
    expect(JSON.parse(redis.zadd.mock.calls[0][1].member).sentiment).toBe('85');
});
test.each(['101', '0', 'positive', '', null])('rejects invalid score %s before database writes', async content => {
    create.mockResolvedValue({ choices: [{ message: { content } }] });
    await expect(POST(req())).rejects.toThrow('invalid sentiment score');
    expect(redis.zrem).not.toHaveBeenCalled();
    expect(redis.zadd).not.toHaveBeenCalled();
    expect(redis.incr).not.toHaveBeenCalled();
});
test('missing credentials do not call AI or Redis', async () => {
    delete process.env.OPENROUTER_API_KEY;
    expect((await POST(req())).status).toBe(503);
    expect(create).not.toHaveBeenCalled();
    expect(redis.zrange).not.toHaveBeenCalled();
});
