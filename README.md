# Automatica - YouTube Subscription Gatekeeper

Gate your content behind YouTube subscriptions. Create exclusive links that only your subscribers can access.

## Features

- 🔐 Verify real YouTube subscriptions with Google OAuth
- 🔗 Create gated links that require subscription verification
- 📊 Creator dashboard to manage gated links
- ✨ Clean, modern UI built with Tailwind CSS
- 🚀 Built with Next.js 14 and TypeScript

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google OAuth & YouTube API

You need to configure Google OAuth and YouTube API credentials to verify subscriptions.

#### Create Google Cloud Project:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - YouTube Data API v3
   - Google+ API (for OAuth)

#### Get Google OAuth Client ID:
1. Go to **Credentials** in Google Cloud Console
2. Click **Create Credentials** → **OAuth Client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain (when deploying)
5. Copy your **Client ID**

#### Get YouTube API Key:
1. Go to **Credentials** in Google Cloud Console
2. Click **Create Credentials** → **API Key**
3. Copy the key

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Then update `.env.local` with your credentials:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

If you want Upstash Redis for production data storage, add these too:

```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How It Works

1. **Create Gated Link**: Use the creator dashboard to create a gated link with:
   - A YouTube channel (that viewers must subscribe to)
   - A destination URL (what they'll access after verification)

2. **Share Link**: Share the generated verification link with your audience

3. **Verify Subscription**: When users visit the link:
   - They sign in with Google
   - The app verifies their YouTube subscription
   - If subscribed, they can access the destination URL

## Project Structure

```
app/
├── components/           # Reusable React components
│   ├── Navbar.tsx
│   ├── LandingSection.tsx
│   ├── LoginSection.tsx
│   └── CreatorDashboard.tsx
├── api/                  # API routes
│   └── verify-subscription/  # Subscription verification endpoint
├── verify/[id]/
│   └── page.tsx         # Verification page
├── page.tsx             # Home page
└── layout.tsx           # Root layout
```

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `YOUTUBE_API_KEY` | YouTube Data API Key | Yes |

## Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy on Other Platforms

Ensure you:
- Set environment variables in your platform's settings
- Use Node.js 18+
- Have the same environment variables configured

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Google OAuth** - Authentication
- **YouTube Data API** - Subscription verification

## License

MIT