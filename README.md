# The Sentiment of The Guardian
This app periodically loads headlines from The Guardian and evaluates their sentiment using OpenAI's GPT-4 model.

It used to use GPT-3.5-turbo model but its results were not ideal. GPT-4 performs much better even though it is a bit pricier. To compensate for that we don't send article description anymore.

# Nextjs app template
Based on [jirihofman/nextjs-fullstack-app-template](https://github.com/jirihofman/nextjs-fullstack-app-template).

[![codecov](https://codecov.io/gh/jirihofman/sentiment-guardian/branch/master/graph/badge.svg)](https://codecov.io/gh/jirihofman/sentiment-guardian)

# TODO
- [ ] make a page visually similar to The Guardian headline section and add sentiment emojis to it? 

# Dev notes, debug
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
