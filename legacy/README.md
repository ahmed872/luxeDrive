# LuxeDrive - Premium Luxury Car Dealership Website

A fully responsive, premium-quality car dealership website built with React, TailwindCSS, and Framer Motion. This project showcases a modern, luxurious design with a Royal Blue & Metallic Silver theme and Golden accent highlights.

## 🌟 Features

### Public-Facing Features

- **Home Page**
  - Full-width hero section with luxury car imagery
  - Special offers and coupon banners
  - Featured cars carousel
  - Customer testimonials
  - Why Choose Us section
  - Call-to-action sections

- **Cars Listing Page**
  - Grid layout with card-style car displays
  - Advanced filtering (brand, year, price range, fuel type)
  - Search functionality with live filtering
  - Sort options (price, year, featured)
  - Pagination
  - Responsive design

- **Car Details Page**
  - Large image carousel (3-5 photos per car)
  - Complete vehicle specifications
  - Coupon application with price calculation
  - "Buy Now" checkout flow
  - Contact seller buttons (WhatsApp & Email)
  - Related cars section

- **Checkout Page**
  - Simple checkout form
  - Order summary with car details
  - Coupon discount display
  - Confirmation message

- **About Us Page**
  - Company history timeline
  - Team member profiles
  - Mission & Vision statements
  - Awards and certifications
  - Company statistics

- **Contact Page**
  - Contact form
  - Google Maps integration
  - Business hours
  - Multiple contact methods
  - WhatsApp quick chat

- **Coupons Page**
  - Active and expired coupons display
  - Copy-to-clipboard functionality
  - Expiry date tracking
  - Color-coded status indicators

### Admin Features

- **Admin Dashboard**
  - Quick statistics overview
  - Analytics charts (Recharts)
  - Recent activity feed
  - Quick action buttons

- **Manage Cars**
  - View all cars in table format
  - Add/Edit/Delete functionality (UI only)
  - Featured status management

- **Manage Coupons**
  - View all coupons
  - Add/Edit/Delete functionality (UI only)
  - Active/Inactive status toggle

- **Analytics**
  - Monthly performance charts
  - Sales by brand pie chart
  - Coupon usage statistics
  - Key performance indicators

### Global Features

- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Framer Motion Animations** - Smooth page transitions and hover effects
- **WhatsApp Integration** - Fixed floating button for instant chat
- **Language Toggle** - English/Arabic support (UI ready)
- **SEO Optimized** - Meta tags and Open Graph support
- **Modern UI/UX** - Clean, elegant design with luxury aesthetic

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - High-quality UI components
- **Lucide Icons** - Beautiful icon set
- **Recharts** - Chart library for analytics
- **Axios** - HTTP client (ready for backend integration)
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
car-dealership/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media files
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CarCard.jsx
│   │   ├── Loading.jsx
│   │   └── WhatsAppButton.jsx
│   ├── context/          # React Context for state management
│   │   └── AppContext.jsx
│   ├── data/             # Mock JSON data
│   │   ├── cars.json
│   │   ├── coupons.json
│   │   └── testimonials.json
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Cars.jsx
│   │   ├── CarDetails.jsx
│   │   ├── Checkout.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Coupons.jsx
│   │   └── admin/        # Admin pages
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageCars.jsx
│   │       ├── ManageCoupons.jsx
│   │       └── Analytics.jsx
│   ├── utils/            # Utility functions
│   │   └── formatters.js
│   ├── App.css           # Global styles
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager (or npm/yarn)

### Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm run dev
# or
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
pnpm run build
# or
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
pnpm run preview
# or
npm run preview
```

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#2563eb` to `#1e40af` (Royal Blue gradient)
- **Accent Gold**: `#f59e0b` to `#d97706` (Golden highlights)
- **Neutral Gray**: `#f9fafb` to `#111827` (Backgrounds and text)
- **Success Green**: `#10b981`
- **Warning Yellow**: `#f59e0b`

### Typography

- **Headings**: Poppins font family
- **Body**: Inter font family
- **Monospace**: For coupon codes

### Border Radius

- Small: `0.625rem`
- Medium: `0.75rem`
- Large: `1rem`
- Extra Large: `1.25rem`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Admin Access

Admin sign-in is **disabled**. The previous demo credentials were hardcoded in
client-side code and printed on the login page itself, which meant any visitor
could open the admin panel. They have been removed.

Real authentication is server-side (secure sessions + roles) and arrives with
the platform rebuild. Until then `/admin/login` renders but cannot sign anyone
in, and every `/admin/*` route stays unreachable by design.

> The original demo behaviour is preserved for reference at the git tag
> `pre-rebuild-reference`.

## 🌐 Backend Integration

The frontend is ready for backend integration. Here's what you need to know:

### API Endpoints (To Be Implemented)

```javascript
// Cars
GET    /api/cars           // Get all cars
GET    /api/cars/:id       // Get car by ID
POST   /api/cars           // Create new car
PUT    /api/cars/:id       // Update car
DELETE /api/cars/:id       // Delete car

// Coupons
GET    /api/coupons        // Get all coupons
POST   /api/coupons        // Create coupon
PUT    /api/coupons/:id    // Update coupon
DELETE /api/coupons/:id    // Delete coupon
POST   /api/coupons/apply  // Apply coupon

// Contact
POST   /api/contact        // Submit contact form

// Checkout
POST   /api/checkout       // Submit purchase inquiry
```

### Data Structure

All mock data is stored in `src/data/` directory:
- `cars.json` - Car inventory
- `coupons.json` - Discount coupons
- `testimonials.json` - Customer reviews

Replace the Context API calls with actual API calls using Axios.

## 🎯 Key Features Implementation

### Coupon System

The coupon system is fully functional on the frontend:
- Validates coupon codes
- Checks expiry dates
- Calculates discounts
- Updates final price

### Filtering & Search

Advanced filtering system with:
- Multi-criteria filtering
- Real-time search
- Price range selection
- Sort options

### Animations

Framer Motion animations include:
- Page transitions
- Scroll-triggered animations
- Hover effects
- Loading states

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Netlify

1. Build the project: `pnpm run build`
2. Drag and drop the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Custom Server

1. Build: `pnpm run build`
2. Serve the `dist` folder with any static file server
3. Configure server for SPA routing (redirect all routes to index.html)

## 🔧 Customization

### Changing Colors

Edit `src/App.css` to modify the color scheme:

```css
:root {
  --primary: oklch(...);  /* Change primary color */
  --accent: oklch(...);   /* Change accent color */
}
```

### Adding New Cars

Edit `src/data/cars.json` and add new car objects following the existing structure.

### Modifying Mock Data

All mock data is in the `src/data/` directory. Edit JSON files to customize content.

## 🐛 Known Issues

- Select component shows a warning in console (does not affect functionality)
- Admin CRUD operations are UI-only (need backend integration)

## 📄 License

This project is created for demonstration purposes.

## 🤝 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ using React, TailwindCSS, and Framer Motion**

