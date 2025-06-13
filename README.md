# Call Shotgun - Travel Companion App

A modern travel companion app that helps young travelers connect, share rides, and discover the best travel deals.

## Features

- **User Trip Matching**: Find travel companions with matching itineraries
- **Group Invites**: Create and join travel groups and outings
- **AI-Powered Itinerary Planning**: Get personalized travel recommendations

## Tech Stack

- Frontend: React Native (iOS) + React (Web) with Expo
- Backend: Node.js + Express
- Database: PostgreSQL
- AI: OpenAI API
- Authentication: JWT + OAuth2

## Project Structure

```
callShotgun/
├── mobile/           # React Native iOS app
├── web/             # React web app
├── backend/         # Node.js + Express server
└── shared/          # Shared types and utilities
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Xcode (for iOS development)
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install mobile app dependencies
   cd ../mobile
   npm install

   # Install web app dependencies
   cd ../web
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each directory
   - Fill in the required environment variables

4. Start the development servers:
   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start mobile app
   cd ../mobile
   npm start

   # Start web app
   cd ../web
   npm start
   ```

## Contributing

This project is under active development. Feel free to submit issues and pull requests.

## License

MIT 