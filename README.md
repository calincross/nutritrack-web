# NutriTrack Web Application

A responsive web application for personal food tracking with meal logging, recipe management, and monthly analytics.

## Features

- **Meal Logging**: Log meals with categories (Breakfast, Lunch, Dinner, Snack), calories, and notes
- **Daily Dashboard**: View today's meals and total calorie intake with goal tracking
- **Monthly Summary**: Analytics with category breakdown and most logged foods
- **Recipe Management**: Create and manage recipes with ingredients and instructions
- **PDF Documents**: Upload and manage diet plans and doctor consultations
- **User Authentication**: Secure login and registration
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile browsers

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 16+ and pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Update API URL in .env if needed
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:5173 in your browser
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx
├── context/            # React context providers
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Authentication

The app uses JWT-based authentication. Users must create an account and log in to access the application.

## API Integration

The frontend communicates with a backend API. Update `VITE_API_URL` to point to your backend server.

## License

MIT
