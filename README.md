# Lab AI Website Platform

An advanced AI-powered website creation platform that combines intuitive design tools with comprehensive analytics and user management capabilities. The platform provides an intelligent, user-friendly website building experience with cutting-edge design and collaboration features.

## Features

- AI-powered website design suggestions
- Comprehensive website analytics dashboard
- Social media integration and analytics
- E-commerce platform integration
- Customer management system
- Scheduling and appointment system
- Secure payment processing with Stripe
- Inventory and fulfillment management

## Technology Stack

- **Frontend**: React.js with TypeScript
- **UI**: Tailwind CSS with shadcn components
- **State Management**: TanStack Query (React Query)
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- PostgreSQL database
- Stripe account for payment processing

### Installation

1. Clone the repository:

```
git clone https://github.com/your-organization/lab-ai-platform.git
cd lab-ai-platform
```

2. Install dependencies:

```
npm install
```

3. Set up environment variables:

Create a `.env` file with the following variables:

```
DATABASE_URL=postgres://user:password@localhost:5432/lab_ai_db
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
SESSION_SECRET=your_session_secret
```

4. Initialize the database:

```
npm run db:push
```

5. Start the development server:

```
npm run dev
```

## Testing

The project uses Jest and React Testing Library for testing. To run the tests:

```
./run-tests.sh         # Run all tests
./run-tests.sh watch   # Run tests in watch mode
./run-tests.sh coverage # Generate coverage report
```

For more information on the testing infrastructure, see [Testing Documentation](client/src/lib/TESTING.md).

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Page components
  - `/src/lib` - Utility functions and hooks
  - `/src/hooks` - Custom React hooks
- `/server` - Backend Express application
  - `/routes.ts` - API routes
  - `/storage.ts` - Data persistence layer
- `/shared` - Shared code between frontend and backend
  - `/schema.ts` - Database schema definitions

## API Documentation

The API endpoints are documented in the code and include:

- Authentication (login, register, logout)
- User management
- Website analytics
- Social media integration
- E-commerce operations
- Appointment scheduling
- Payment processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Acknowledgments

- The Lab AI Team
- Our customers and partners