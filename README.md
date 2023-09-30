# The Sentiment of The Guardian
This app periodically loads headlines from The Guardian and evaluates their sentiment using OpenAI's GPT-4 model.

It used to use GPT-3.5-turbo model but its results were not perfect. GPT-4 performs much better even though it is a bit pricier.

# Nextjs app template
Based on [jirihofman/nextjs-fullstack-app-template](https://github.com/jirihofman/nextjs-fullstack-app-template).

[![codecov](https://codecov.io/gh/jirihofman/sentiment-guardian/branch/master/graph/badge.svg)](https://codecov.io/gh/jirihofman/sentiment-guardian)

# TODO
- fix GitHub Actions
- setup codecov
- add @vercel/analytics
- remove storing description
- nicer button interaction
- automatically load articles
- automatically evaluate articles
- separate page with Guardian look only with added sentiment as emojis
- use the guardian repo for looks?
- cache the shit (requests/month, Data transfer)
