# ✈️ EcoJets - Premium Private Jet Booking Platform

> A full-stack web application for discovering, booking, and tracking private jet flights with real-time weather integration and comprehensive flight management.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://ecojets-dovl3bw4e-kkvishvaas-projects.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Live-green?style=for-the-badge)](https://ejet.onrender.com)

![FlightFinder Screenshot](https://via.placeholder.com/1200x600/1e293b/ffffff?text=FlightFinder+-+Premium+Private+Jet+Platform)

## 🚀 Live Application

- **Frontend**: [https://ecojets-dovl3bw4e-kkvishvaas-projects.vercel.app](https://ecojets-dovl3bw4e-kkvishvaas-projects.vercel.app)
or
https://ecojets.vercel.app/
- **Backend API**: [https://ejet.onrender.com](https://ejet.onrender.com)

## ✨ Features

### 🛩️ Core Functionality
- **Flight Search & Discovery** - Advanced search with intelligent airport autosuggestion
- **Private Jet Booking** - Complete end-to-end booking system with confirmation
- **Flight Tracking** - Real-time flight tracking with live status updates
- **Aircraft Gallery** - Browse premium private jets with detailed specifications
- **Weather Integration** - Real-time weather data for departure/arrival locations

### 🎨 User Experience
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Real-time Updates** - Live data integration for flights and weather
- **Interactive Components** - Dynamic forms, modals, and navigation

### 🔧 Technical Features
- **RESTful API** - Comprehensive backend API with proper error handling
- **Data Validation** - Robust input validation using Zod schemas
- **CORS Enabled** - Proper cross-origin resource sharing configuration
- **Performance Optimized** - Code splitting and optimized builds

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── aircraft-card.tsx
│   │   ├── flight-search-form.tsx
│   │   └── weather-widget.tsx
│   ├── pages/              # Application pages
│   │   ├── home.tsx        # Landing page
│   │   ├── search.tsx      # Flight search results
│   │   ├── booking.tsx     # Booking interface
│   │   ├── jets.tsx        # Aircraft gallery
│   │   ├── track.tsx       # Flight tracking
│   │   └── deals.tsx       # Special offers
│   ├── lib/                # Utilities and configuration
│   │   ├── queryClient.ts  # React Query setup
│   │   ├── api.ts          # API configuration
│   │   └── utils.ts        # Helper functions
│   └── hooks/              # Custom React hooks
```

### Backend (Express.js + Node.js)
```
server/
├── index.ts                # Express server setup
├── routes.ts               # API route definitions
├── storage.ts              # Data layer abstraction
├── services/
│   └── externalApis.ts     # External API integrations
└── data/
    └── airports.csv        # Airport database (87 airports)
```

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI component library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form state management
- **Framer Motion** - Smooth animations
- **Wouter** - Lightweight routing
- **Lucide React** - Beautiful icon library

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type safety for backend
- **CORS** - Cross-origin resource sharing
- **Zod** - Runtime type validation
- **CSV Parser** - Airport data processing

### External APIs & Services
- **OpenSky Network API** - Real-time flight tracking data
- **OpenMeteo API** - Weather information and forecasts
- **OurAirports Dataset** - Comprehensive airport database

### Deployment & Infrastructure
- **Vercel** - Frontend hosting and deployment
- **Render** - Backend hosting and API deployment
- **GitHub** - Version control and CI/CD
- **Git** - Source code management

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kkvishvaa/EJET.git
   cd EJET
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Start production server**
   ```bash
   npm start
   ```

### Environment Configuration

Create environment-specific configurations in `client/src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://ejet.onrender.com'
  : 'http://localhost:5001';
```

## 📡 API Endpoints

### Aircraft Management
- `GET /api/aircraft` - Retrieve all aircraft
- `GET /api/aircraft/:id` - Get specific aircraft details

### Flight Operations
- `GET /api/flights/search` - Search available flights
- `POST /api/flights` - Create new flight
- `GET /api/flights/:id` - Get flight details

### Booking System
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details

### External Data
- `GET /api/weather` - Weather information
- `GET /api/airports` - Airport database
- `GET /api/flights/track` - Flight tracking data

### Popular Destinations
- `GET /api/destinations/popular` - Get popular destinations

## 🎯 Key Features Implemented

### 🔍 Advanced Search System
- **Airport Autosuggestion**: Intelligent search with 87 airports database
- **Real-time Results**: Instant search results with type-ahead functionality
- **Location-based Search**: Search by city names or airport codes

### 🛩️ Aircraft Management
- **Comprehensive Database**: Detailed aircraft specifications and imagery
- **Interactive Gallery**: Visual aircraft browser with filtering capabilities
- **Booking Integration**: Direct booking from aircraft selection

### 🌤️ Weather Integration
- **Real-time Weather**: Current conditions for departure/arrival locations
- **Weather Widgets**: Interactive weather displays throughout the app
- **Location-based Data**: Automatic weather fetching based on airport coordinates

### 📱 Responsive Design
- **Mobile-first Approach**: Optimized for all device sizes
- **Touch-friendly Interface**: Intuitive touch interactions
- **Progressive Enhancement**: Works seamlessly across browsers

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run check        # TypeScript type checking

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push     # Push database schema changes
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
3. Deploy automatically on git push

### Backend Deployment (Render)
1. Connect GitHub repository to Render
2. Configure service:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Auto-deploy from main branch

## 🔐 Security Features

- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Zod schema validation for all inputs
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Comprehensive error management

## 🎨 UI/UX Features

- **Dark/Light Theme**: System preference detection
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Skeleton loaders and progress indicators
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels and keyboard navigation

## 📊 Performance Optimizations

- **Code Splitting**: Dynamic imports for route-based splitting
- **Bundle Analysis**: Optimized chunk sizes
- **Image Optimization**: Lazy loading and responsive images
- **Caching Strategy**: React Query for intelligent data caching

## 🧪 Testing & Quality

- **TypeScript**: Full type coverage
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Vishvaa KK**
- GitHub: [@kkvishvaa](https://github.com/kkvishvaa)
- Project: [FlightFinder](https://github.com/kkvishvaa/EJET)

## 🙏 Acknowledgments

- **OpenSky Network** - Flight tracking data
- **OpenMeteo** - Weather API services
- **OurAirports** - Airport database
- **Shadcn/ui** - UI component library
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📈 Project Stats

- **Total Components**: 50+ React components
- **API Endpoints**: 15+ RESTful endpoints
- **External APIs**: 3 integrated services
- **Airport Database**: 87 airports worldwide
- **UI Components**: Shadcn/ui component library
- **Type Safety**: 100% TypeScript coverage

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[Live Demo](https://ecojets-dovl3bw4e-kkvishvaas-projects.vercel.app) • [API Documentation](https://ejet.onrender.com/api) • [Report Bug](https://github.com/kkvishvaa/EJET/issues) • [Request Feature](https://github.com/kkvishvaa/EJET/issues)

</div>
