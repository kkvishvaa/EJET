# Overview

JetCharter is a premium private jet booking platform built with a modern full-stack architecture. The application provides a luxury-grade user experience for browsing aircraft, searching flights, tracking bookings, and managing reservations. It features a comprehensive aircraft fleet management system, real-time flight tracking capabilities, and a complete booking workflow with payment processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 and TypeScript, utilizing a component-based architecture with modern UI patterns:

- **UI Framework**: React with shadcn/ui components for consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a page-based structure with reusable components for aircraft cards, destination displays, and booking forms. Pages include Home, Jets catalog, Search interface, Flight tracking, Deals, and Dashboard.

## Backend Architecture
The server uses Node.js with Express in a RESTful API pattern:

- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js with middleware for JSON parsing and CORS
- **Storage**: In-memory storage implementation with interfaces for future database integration
- **API Design**: RESTful endpoints for aircraft, flights, bookings, and destinations
- **Validation**: Zod schemas shared between client and server for type safety

The backend implements a service layer pattern with storage abstraction, allowing for easy swapping of data persistence mechanisms.

## Data Storage
Currently uses in-memory storage with plans for PostgreSQL integration:

- **ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Database**: Neon serverless PostgreSQL (configured but not yet connected)
- **Schema**: Comprehensive tables for users, aircraft, flights, bookings, and destinations
- **Migrations**: Drizzle Kit for database schema management

## Development Workflow
The project uses a monorepo structure with shared TypeScript types and schemas:

- **Shared Code**: Common types and validation schemas in `/shared` directory
- **Development**: Hot reload with Vite for frontend and tsx for backend
- **Build Process**: Separate build steps for client (Vite) and server (esbuild)
- **Type Safety**: End-to-end TypeScript with shared interfaces

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Validation**: Zod for schema validation across client and server

## Backend Services
- **Database**: Neon serverless PostgreSQL with Drizzle ORM
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, Vite for frontend bundling

## Build and Development Tools
- **TypeScript**: Full-stack type safety with shared configurations
- **Build Tools**: Vite (frontend), esbuild (backend), PostCSS, Autoprefixer
- **Development**: Replit-specific plugins for runtime error overlay and cartographer

## Planned Integrations
Based on the README files, the system is designed to integrate:
- **Payment Processing**: Razorpay for secure payment handling
- **Flight Tracking**: OpenSky Network API for real-time aircraft positions
- **Weather Data**: Airport weather conditions and forecasts
- **Image Assets**: Unsplash API for high-quality aircraft and destination photography

The architecture supports luxury private jet operations with features for fleet management, booking workflows, pricing calculations, and customer dashboards.