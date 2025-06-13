# Call Shotgun - Travel Companion App

A modern travel companion app that helps young travelers connect, share rides, and discover the best travel deals.

## Features

- **User Trip Matching**: Find travel companions with matching itineraries
- **Group Invites**: Create and join travel groups and outings
- **AI-Powered Itinerary Planning**: Get personalized travel recommendations

## Tech Stack

- Frontend: React Native (iOS) + React (Web) with Expo
- Backend: Node.js + Express + TypeScript
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
```bash
git clone https://github.com/wasumayan/callShotgun.git
cd callShotgun
```

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
   - Fill in the required environment variables:
     ```
     PORT=3000
     DATABASE_URL=postgresql://localhost:5432/callshotgun
     JWT_SECRET=your_jwt_secret
     OPENAI_API_KEY=your_openai_api_key
     ```

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

## API Documentation

### Authentication Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get user profile (requires authentication)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/wasumayan/callShotgun](https://github.com/wasumayan/callShotgun) 