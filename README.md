# YouTube Subscription Gate

This is a Next.js application that requires users to subscribe to a YouTube channel before accessing a protected link.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Check YouTube subscription status
- Gate access to links based on subscription

## Setup YouTube API

To use the YouTube API, you need to set up a Google Cloud project and enable the YouTube Data API v3.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the YouTube Data API v3.
4. Create credentials (API key or OAuth 2.0 client ID).
5. Add the API key to your environment variables.

## Deploy

Deploy on Vercel or any other platform that supports Next.js.