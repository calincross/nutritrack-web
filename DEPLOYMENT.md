# NutriTrack Web Application - Deployment Guide

## Project Overview

NutriTrack is a complete personal food tracking web application with:
- User authentication and account management
- Meal logging with categories and calorie tracking
- Monthly analytics and statistics
- Recipe management with search
- PDF document uploads (diet plans and doctor consultations)
- Responsive design for desktop and mobile

## Project Structure

```
nutritrack-web/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/              # Reusable components
│   ├── context/                 # Auth context provider
│   ├── pages/                   # Page components
│   ├── services/                # API client
│   ├── types/                   # TypeScript types
│   ├── App.tsx                  # Main app
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── server/                       # Backend (Express + MySQL)
│   ├── src/
│   │   ├── db/                  # Database schema & connection
│   │   ├── middleware/          # Auth & upload middleware
│   │   ├── routes/              # API routes
│   │   └── index.ts             # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
├── package.json                 # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── index.html                  # HTML entry point
```

## Prerequisites

- Node.js 16+ and pnpm
- MySQL 8.0+ (or compatible database)
- Git

## Local Development Setup

### 1. Clone and Install

```bash
cd nutritrack-web
pnpm install
cd server && pnpm install && cd ..
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE nutritrack;
```

### 3. Environment Configuration

Create `.env` in the root directory:

```
VITE_API_URL=http://localhost:3000/api
```

Create `server/.env`:

```
PORT=3000
JWT_SECRET=your-super-secret-key-change-in-production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nutritrack
```

### 4. Database Migration

```bash
cd server
pnpm db:push
cd ..
```

### 5. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

Frontend will be available at `http://localhost:5173`
Backend API at `http://localhost:3000`

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variable:
   - `VITE_API_URL=https://your-api-domain.com/api`
4. Deploy

#### Backend (Railway)

1. Push code to GitHub
2. Create Railway project
3. Add MySQL plugin
4. Set environment variables:
   - `PORT=3000`
   - `JWT_SECRET=your-secret`
   - `DB_HOST=railway-mysql-host`
   - `DB_USER=root`
   - `DB_PASSWORD=password`
   - `DB_NAME=nutritrack`
5. Deploy

### Option 2: Deploy to DigitalOcean App Platform

1. Create a new app
2. Connect GitHub repository
3. Configure:
   - **Frontend Service**: Build command `pnpm build`, Run command `pnpm preview`
   - **Backend Service**: Build command `cd server && pnpm build`, Run command `cd server && pnpm start`
   - **Database**: Add managed MySQL
4. Set environment variables for both services
5. Deploy

### Option 3: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN pnpm install

# Copy source
COPY . .

# Build
RUN pnpm build

# Expose ports
EXPOSE 3000 5173

# Start both services
CMD ["sh", "-c", "cd server && pnpm start & pnpm preview"]
```

Build and run:

```bash
docker build -t nutritrack .
docker run -p 3000:3000 -p 5173:5173 nutritrack
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Meals
- `GET /api/meals` - Get all meals (supports date filtering)
- `POST /api/meals` - Create meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/search?q=query` - Search recipes
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents?type=diet-plan` - Get by type
- `POST /api/documents/upload` - Upload PDF
- `DELETE /api/documents/:id` - Delete document

### User
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/calorie-goal` - Update calorie goal
- `PUT /api/user/diet-type` - Update diet type

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `dailyCalorieGoal` (INT, Default: 2000)
- `dietType` (VARCHAR, Default: 'balanced')
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Meals Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `name` (VARCHAR)
- `category` (VARCHAR) - Breakfast, Lunch, Dinner, Snack
- `calories` (INT)
- `date` (VARCHAR) - YYYY-MM-DD format
- `time` (VARCHAR) - HH:MM format
- `notes` (TEXT, Optional)
- `createdAt` (DATETIME)

### Recipes Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `name` (VARCHAR)
- `ingredients` (TEXT, JSON stringified)
- `instructions` (TEXT)
- `caloriesPerServing` (INT)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Documents Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `name` (VARCHAR)
- `type` (VARCHAR) - 'diet-plan' or 'consultation'
- `url` (VARCHAR)
- `size` (INT)
- `createdAt` (DATETIME)

## Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` in production
2. **CORS**: Configure CORS for your frontend domain
3. **HTTPS**: Always use HTTPS in production
4. **Database**: Use strong passwords and SSL connections
5. **File Uploads**: Only PDF files allowed, max 50MB
6. **Rate Limiting**: Consider adding rate limiting middleware
7. **Input Validation**: All inputs are validated on the backend

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### API Not Responding
- Check backend is running on port 3000
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings

### File Upload Issues
- Ensure `/uploads` directory exists
- Check file is PDF format
- Verify file size < 50MB

### Build Errors
- Clear `node_modules` and reinstall: `pnpm install`
- Clear build cache: `rm -rf dist && pnpm build`
- Check Node.js version: `node --version` (should be 16+)

## Performance Optimization

1. **Frontend**:
   - Code splitting with React Router
   - Lazy loading of pages
   - Image optimization
   - CSS minification

2. **Backend**:
   - Database indexing on frequently queried fields
   - Query optimization
   - Caching strategies
   - Connection pooling

3. **Deployment**:
   - CDN for static assets
   - Gzip compression
   - Database backups
   - Monitoring and logging

## Maintenance

- Regular database backups
- Monitor API performance
- Update dependencies monthly
- Review security logs
- Clean up old files periodically

## Support & Documentation

For more information, refer to:
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT
