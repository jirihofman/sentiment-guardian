# The Sentiment of The Guardian
This app periodically loads headlines from The Guardian and evaluates their sentiment through OpenRouter.

## AI configuration

Set `OPENROUTER_API_KEY` in `.env.local` and in your deployment environment. Direct OpenAI credentials are no longer used. The OpenAI SDK is retained as an OpenRouter-compatible HTTP client.

Model IDs are configured in [`lib/const.js`](lib/const.js). All tasks use OpenRouter:

| Task | OpenRouter model ID | Reasoning | Output |
| --- | --- | --- | --- |
| Headline sentiment assessment | `openai/gpt-5.6-luna` | Disabled (`none`) | A validated score from 1 to 100 |
| Headline commentary | `openai/gpt-5.6-terra` | Disabled (`none`) | Short commentary, capped at 96 output tokens |
| Monthly persons of interest | `openai/gpt-5.6-terra` | Low (`low`) | Three people selected from the month's headlines, using structured JSON |
| Commentary speech | `openai/gpt-4o-mini-tts-2025-12-15` | Not applicable | MP3 audio using the `alloy` voice |

Luna handles numeric classification; Terra handles commentary and synthesis across headlines. Commentary reasoning is disabled to preserve its short output budget. Reasoning and speech settings are configured in the corresponding API routes.

Synchronous sentiment, commentary, and monthly persons-of-interest requests ask OpenRouter for `service_tier: "flex"`, including the regeneration script's `--single` mode. [Flex processing](https://openrouter.ai/docs/guides/features/service-tiers) trades latency and availability for lower cost. Capacity errors can surface without standard-tier fallback; if a model has no Flex endpoints, OpenRouter may route at standard rates. The response's `service_tier` reports the tier actually served. Speech and Batch API requests do not set this parameter; batch processing has its own pricing.

Sentiment backfills use Luna. Persons-of-interest backfills and regenerations use Terra, including the batch script and its `--single` mode. Updating a model default does not recalculate stored data; historical results retain their previous assessments until explicitly regenerated.

Existing Redis keys are preserved so previously generated commentary and audio remain available.

The regeneration script uses [OpenRouter's Batch API](https://openrouter.ai/docs/batch-quickstart). Run with `node --env-file=.env.local scripts/batch-poi-regenerate.js` and follow its help. Run `--prepare` again after migrating; old OpenAI batch IDs cannot be retrieved through OpenRouter. OpenRouter batch artifacts use separate filenames to preserve old job records. Submission sends inline requests; retrieval reads inline results and stores them in Redis.

# Nextjs app template
Based on [jirihofman/nextjs-fullstack-app-template](https://github.com/jirihofman/nextjs-fullstack-app-template).

[![codecov](https://codecov.io/gh/jirihofman/sentiment-guardian/branch/master/graph/badge.svg)](https://codecov.io/gh/jirihofman/sentiment-guardian) ![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/jirihofman/sentiment-guardian?utm_source=oss&utm_medium=github&utm_campaign=jirihofman%2Fsentiment-guardian&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

# Dev notes, debug
## Using MCP Upstash Server

This project supports integration with the MCP Upstash server for managing and interacting with Upstash Redis.

To enable this:

1. Ensure you have the required credentials for your Upstash Redis instance:
   - Upstash REST URL
   - Upstash REST Token
   - Upstash REST Email
   - Upstash REST API Key

2. The configuration for the MCP Upstash server is located in `.vscode/mcp.json`. When starting the server, you will be prompted for these credentials.

3. The server is started using the `@upstash/mcp-server` package and connects to your Upstash Redis instance securely.

This setup allows you to manage your Upstash Redis data directly from your development environment using MCP.

### Example prompts
- find lowest sentiment for a range 2024-01-01 - 2024-01-05
- how many records is there in article:guardian

## @upstash/redis
```sh
# Set initial categories for existing articles
set category:guardian:NEG1 8
set category:guardian:NEG2 5
set category:guardian:NEU 6
set category:guardian:POS1 1
set category:guardian:NEU 0
```
## Manually populating the DB
```sh
curl -XPOST https://sentiment-guardian.vercel.app/api/articles -d '{"adminApiKey":"ADMIN_API_KEY"}'
curl -XPOST https://sentiment-guardian.vercel.app/api/sentiment -d '{"adminApiKey":"ADMIN_API_KEY"}'
```
