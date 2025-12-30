# 🥗 NutriTrack - Personal Food Tracker

A modern, full-stack web application for tracking meals, managing recipes, monitoring nutrition, and storing diet-related documents.

## ✨ Features

### 📊 Meal Tracking
- Log meals with categories (Breakfast, Lunch, Dinner, Snack)
- Track calories and nutritional information
- View daily meal history
- Edit and delete meals
- Time-based meal organization

### 📈 Analytics & Insights
- Monthly summary with statistics
- Daily calorie tracking against goals
- Category breakdown charts
- Most logged foods analysis
- Daily average calculations
- Visual data representations

### 🍳 Recipe Management
- Create and save custom recipes
- Search recipes by name
- Store ingredients and instructions
- Track calories per serving
- Edit and delete recipes
- Use recipes for meal logging

### 📄 Document Management
- Upload diet plans (PDF)
- Upload doctor consultations (PDF)
- Organize documents by type
- Download stored documents
- Delete documents

### 👤 User Profile
- Set daily calorie goals
- Choose diet type (Balanced, Keto, Vegan, etc.)
- View account statistics
- Manage preferences

### 📧 Email Notifications
- Welcome email on registration
- Calorie goal achievement alerts
- Optional daily reminders
- Optional weekly reports

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly interface
- Optimized for all screen sizes
- Fast and smooth performance

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide Icons** - Icons
- **date-fns** - Date utilities

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **MySQL** - Database
- **Drizzle ORM** - Database ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- pnpm (or npm/yarn)
- MySQL 8.0+

### Local Development

1. **Clone and Install**
```bash
cd nutritrack-web
pnpm install
cd server && pnpm install && cd ..
```

2. **Setup Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE nutritrack;
EXIT;

# Run migrations
cd server
pnpm db:push
cd ..
```

3. **Configure Environment**
```bash
# Create .env
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Create server/.env
cat > server/.env << EOF
PORT=3000
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nutritrack
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@nutritrack.com
EOF
```

4. **Run Development Servers**

Terminal 1 - Backend:
```bash
cd server
pnpm dev
```

Terminal 2 - Frontend:
```bash
pnpm dev
```

Visit `http://localhost:5173`

## 📚 Documentation

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Deploy to Vercel + Railway (recommended)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment options
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Email notification configuration

## 🏗️ Project Structure

```
nutritrack-web/
├── src/                          # Frontend React app
│   ├── components/              # Reusable components
│   │   ├── Layout.tsx          # Main layout
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── context/                # Auth context
│   ├── pages/                  # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx       # Meal logging
│   │   ├── Summary.tsx         # Analytics
│   │   ├── Recipes.tsx         # Recipe management
│   │   ├── Files.tsx           # Document upload
│   │   └── Profile.tsx         # Settings
│   ├── services/               # API client
│   ├── types/                  # TypeScript types
│   ├── App.tsx                 # Main app
│   └── main.tsx                # Entry point
├── server/                      # Backend Express app
│   ├── src/
│   │   ├── db/                 # Database schema
│   │   ├── middleware/         # Auth & upload
│   │   ├── routes/             # API routes
│   │   ├── services/           # Email service
│   │   └── index.ts            # Server entry
│   ├── package.json
│   └── drizzle.config.ts
├── public/                      # Static assets
├── package.json                # Frontend deps
├── vite.config.ts             # Vite config
├── tailwind.config.js         # Tailwind config
└── tsconfig.json              # TypeScript config
```

## 🔐 Authentication

- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes
- Auto-logout on token expiration
- Session persistence

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register     # Create account
POST   /api/auth/login        # Login
GET    /api/auth/profile      # Get profile
POST   /api/auth/logout       # Logout
```

### Meals
```
GET    /api/meals             # Get all meals
POST   /api/meals             # Create meal
PUT    /api/meals/:id         # Update meal
DELETE /api/meals/:id         # Delete meal
```

### Recipes
```
GET    /api/recipes           # Get all recipes
GET    /api/recipes/search    # Search recipes
POST   /api/recipes           # Create recipe
PUT    /api/recipes/:id       # Update recipe
DELETE /api/recipes/:id       # Delete recipe
```

### Documents
```
GET    /api/documents         # Get all documents
POST   /api/documents/upload  # Upload PDF
DELETE /api/documents/:id     # Delete document
```

### User
```
PUT    /api/user/profile      # Update profile
PUT    /api/user/calorie-goal # Update goal
PUT    /api/user/diet-type    # Update diet type
```

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` and `src/index.css` to customize colors and styling.

### Email Templates
Edit `server/src/services/email.ts` to customize email content and design.

### Database Schema
Modify `server/src/db/schema.ts` to add new fields or tables.

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run backend tests
cd server && pnpm test && cd ..
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env
cat server/.env
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules server/node_modules
pnpm install
cd server && pnpm install && cd ..
```

## 📈 Performance Tips

1. **Frontend**
   - Use React DevTools to identify slow renders
   - Implement code splitting for large pages
   - Optimize images and assets

2. **Backend**
   - Add database indexes on frequently queried fields
   - Use connection pooling
   - Implement caching for static data

3. **Deployment**
   - Use CDN for static files
   - Enable gzip compression
   - Set up monitoring and alerts

## 🔒 Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ CORS configured
- ✅ Input validation on backend
- ✅ SQL injection prevention (ORM)
- ✅ File upload validation (PDF only)
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add CSRF protection

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review documentation files
3. Check backend logs: `cd server && pnpm dev`
4. Check frontend console: Open DevTools (F12)

## 🎯 Roadmap

### Planned Features
- [ ] Photo capture for meals
- [ ] Barcode scanning for products
- [ ] Nutritional information database
- [ ] Social sharing
- [ ] Mobile app (React Native)
- [ ] AI-powered meal suggestions
- [ ] Integration with fitness trackers
- [ ] Advanced analytics
- [ ] Multi-user families
- [ ] Meal planning

### Performance Improvements
- [ ] Database query optimization
- [ ] Frontend bundle size reduction
- [ ] Image lazy loading
- [ ] Caching strategies

### Security Enhancements
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Two-factor authentication
- [ ] Audit logging

## 🙏 Acknowledgments

Built with modern web technologies and best practices.

---

**Made with ❤️ for health-conscious developers**

**Ready to deploy?** Check out [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for the easiest way to get live!
