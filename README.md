# The Sentiment of The Guardian
This app periodically loads headlines from The Guardian and evaluates their sentiment using OpenAI's GPT-4 model.

It used to use GPT-3.5-turbo model but its results were not ideal. GPT-4 performs much better even though it is a bit pricier. To compensate for that we don't send article description anymore.

Since 2023-11-30 `gpt-4-1106-preview` is used to save some bucks.

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
