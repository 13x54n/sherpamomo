# Sherpa Momo Admin Dashboard

A separate Next.js application for managing the Sherpa Momo food delivery platform.

## Features

- **Dashboard Overview**: Real-time statistics and key metrics
- **Product Management**: CRUD operations for products, inventory tracking
- **Order Management**: View and update order statuses, customer details
- **User Management**: Customer account management (future feature)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Type Safety**: TypeScript
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Development

Start the development server:
```bash
npm run dev
```

The admin app will be available at `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
admin-app/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin layout with sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Dashboard overview
│   │   │   ├── products/
│   │   │   │   └── page.tsx        # Product management
│   │   │   └── orders/
│   │   │       └── page.tsx        # Order management
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/                     # shadcn/ui components
│   └── lib/
│       ├── api/                    # API client and functions
│       └── utils.ts
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## API Integration

The admin app communicates with the backend API for:

- **Products**: Create, read, update, delete products
- **Orders**: Fetch orders, update order statuses
- **Analytics**: Dashboard statistics and metrics

## Authentication

Currently uses simple admin check. In production, implement proper authentication with:

- JWT tokens
- Role-based access control
- Admin user management

## Features Overview

### Dashboard
- Revenue metrics and trends
- Order statistics
- Low stock alerts
- Recent order activity

### Product Management
- Add/edit/delete products
- Inventory tracking
- Category management
- Featured product settings

### Order Management
- View all orders with filtering
- Update order statuses
- Customer information
- Order details and history

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add loading states for better UX
5. Test on both desktop and mobile

## License

This project is part of the Sherpa Momo platform.