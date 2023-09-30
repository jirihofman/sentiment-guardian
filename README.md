# The Sentiment of The Guardian
This app periodically loads headlines from The Guardian and evaluates their sentiment using OpenAI's GPT-4 model.

It used to use GPT-3.5-turbo model but its results were not ideal. GPT-4 performs much better even though it is a bit pricier. To compoensate for that we don't send article description anymore.

# Nextjs app template
Based on [jirihofman/nextjs-fullstack-app-template](https://github.com/jirihofman/nextjs-fullstack-app-template).

[![codecov](https://codecov.io/gh/jirihofman/sentiment-guardian/branch/master/graph/badge.svg)](https://codecov.io/gh/jirihofman/sentiment-guardian)

# TODO
- [ ] setup codecov
- [ ] add @vercel/analytics
- [ ] make a page visually similar to The Guardian headline section and add sentiment emojis to it? 
- [ ] cache the stuff in components/article-table (requests/month, Data transfer)
