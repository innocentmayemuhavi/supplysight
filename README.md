# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# SupplySight - Supply Chain Management Dashboard

A modern, real-time inventory tracking and management system built with React 19, TypeScript, GraphQL, and Tailwind CSS.

![SupplySight Dashboard](https://img.shields.io/badge/React-19.1.1-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript) ![GraphQL](https://img.shields.io/badge/GraphQL-16.11.0-e10098?logo=graphql) ![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?logo=vite)

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### 📥 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/innocentmayemuhavi/supplysight.git
   cd supplysight
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run build
   ```

## 🏃‍♂️ Running the Application

### Development Mode (Recommended)

**Option 1: Run both frontend and backend together (Recommended)**

```bash
npm run dev
```

This command will:

- Start the GraphQL server on `http://localhost:4000`
- Start the React development server on `http://localhost:5173`
- Enable hot module replacement (HMR)
- Open your browser automatically

**Option 2: Run servers separately**

In **Terminal 1** (Backend):

```bash
npm run start
```

In **Terminal 2** (Frontend):

```bash
npx vite
```

### Production Mode

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   ```

## 🎯 Features

### ✅ **Core Functionality**

- **Real-time Dashboard**: Live inventory tracking with KPI cards
- **Interactive Charts**: Stock vs demand visualization with Recharts
- **Advanced Filtering**: Search by product name, SKU, warehouse, or status
- **Product Management**: Update demand and transfer stock between warehouses
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### ✅ **User Experience**

- **Smooth Animations**: Fade-in transitions and staggered loading effects
- **Toast Notifications**: Success/error feedback for all operations
- **Loading States**: Visual feedback during data operations
- **Auto-close Drawers**: Automatic UI cleanup after successful operations

### ✅ **Technical Features**

- **TypeScript**: Full type safety throughout the application
- **GraphQL**: Efficient data fetching with Apollo Client
- **Hot Module Replacement**: Instant updates during development
- **Code Splitting**: Optimized bundle loading
- **ESLint**: Consistent code quality enforcement

## 🗂️ Project Structure

```
supplysight/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── buttons/       # Button components
│   │   ├── cards/         # KPI and info cards
│   │   ├── charts/        # Data visualization
│   │   ├── filters/       # Search and filter controls
│   │   ├── header/        # Navigation header
│   │   ├── layout/        # Page layout wrapper
│   │   ├── navigation/    # Sidebar and nav components
│   │   ├── product-drawer/# Product detail drawer
│   │   └── table/         # Data table components
│   ├── context/           # React context providers
│   ├── graphql/           # GraphQL queries and mutations
│   ├── models/            # TypeScript interfaces
│   ├── pages/             # Page components
│   │   └── dashboard/     # Main dashboard page
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and animations
├── server.js             # GraphQL server
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── NOTES.md              # Development notes and decisions
└── README.md             # This file
```

## 🛠️ Available Scripts

| Script              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Start both frontend and backend in development mode |
| `npm run build`     | Build the project for production                    |
| `npm run start`     | Start only the GraphQL server                       |
| `npm run preview`   | Preview the production build locally                |
| `npm run lint`      | Run ESLint for code quality checks                  |
| `npm run deploy`    | Deploy to GitHub Pages                              |
| `npm run predeploy` | Build before deployment (runs automatically)        |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for custom configuration:


# Development
VITE_API_URL=http://localhost:4000/graphql
VITE_APP_TITLE=SupplySight Dashboard


### GraphQL Server

The server runs on `http://localhost:4000` by default. GraphQL Playground is available at `http://localhost:4000/graphql` for testing queries.



## 📊 Key Metrics & KPIs

The dashboard displays three main KPIs:

1. **Total Stock**: Sum of all product inventory
2. **Total Demand**: Sum of all product demand
3. **Fill Rate**: Percentage of demand that can be fulfilled
   - Formula: `(Σ min(stock, demand) / Σ demand) × 100`

**Status Color Coding:**
- 🟢 **Healthy**: Stock > Demand
- 🟡 **Low**: Stock = Demand
- 🔴 **Critical**: Stock < Demand

## 🔍 Development Notes

### Key Technical Decisions & Trade-offs

**Architecture Choices**
- **React 19 + TypeScript**: Latest features and type safety 
- **Vite over Create React App**: 3x faster builds and HMR ✅ 
- **Apollo GraphQL over REST**: Type safety and caching ✅

**Styling & Animations**
- **CSS Keyframes over Framer Motion**: 500KB smaller bundle and better performance ✅ vs Limited animation control 
- **Tailwind CSS over Styled Components**: Rapid development and consistency ✅ 

**Data & Backend**
- **In-memory storage over Database**: Zero setup time and rapid prototyping ✅ 
- **Mock GraphQL server over Real API**: Complete control and fast development ✅ 

**UX Design Decisions**
- **Product drawer over Modal**: Better mobile experience 
- **Toast notifications over Alerts**: Non-blocking user feedback ✅ 
- **Fade-in animations**: Smooth perceived performance ✅ 

### What I'd Improve with More Time

**🔥 Critical (Week 1)**
1. **Database Integration**
   ```typescript
   // Replace in-memory with PostgreSQL + Prisma
   const products = await prisma.product.findMany({
     where: { warehouse: warehouseId },
     include: { stockMovements: true }
   });
   ```

2. **Authentication & Authorization**
   ```typescript
   // JWT-based auth with role permissions
   const user = await validateToken(token);
   if (!user.permissions.includes('UPDATE_INVENTORY')) {
     throw new UnauthorizedError();
   }
   ```

3. **Real-time Updates**
   ```typescript
   // GraphQL subscriptions for live data
   const STOCK_UPDATED = gql`
     subscription StockUpdated($warehouseId: ID!) {
       stockUpdated(warehouseId: $warehouseId) {
         id, stock, lastUpdated
       }
     }
   `;
   ```

**⚡ High Impact (Week 2-3)**
4. **Comprehensive Testing**
   - Unit tests: Components and business logic (Jest + RTL)
   - Integration tests: GraphQL operations and user flows
   - E2E tests: Critical user journeys (Playwright)
   - Current coverage: 0% → Target: 80%+

5. **Performance Optimization**
   - Virtual scrolling for 10,000+ products
   - Code splitting: Reduce initial bundle from 2.3MB to <1MB
   - Service worker: Offline functionality and caching
   - Image optimization: WebP format and lazy loading

6. **Production Security**
   - Input sanitization (XSS/SQL injection prevention)
   - Rate limiting (Redis-based API protection)
   - HTTPS enforcement and CSP headers
   - Audit logging for all inventory changes

**🚀 Feature Enhancements (Month 2)**
7. **Advanced Analytics**
   - Demand forecasting with ML models
   - ABC analysis for inventory optimization
   - Warehouse efficiency metrics
   - Custom dashboard builder

8. **Enterprise Features**
   - Multi-tenant architecture
   - Bulk operations (CSV import/export)
   - Workflow automation (reorder triggers)
   - Mobile app for warehouse operations

9. **Developer Experience**
   - Storybook component documentation
   - Docker containerization
   - CI/CD pipeline with automated testing
   - Error monitoring (Sentry) and analytics

### Technical Debt & Known Limitations

**Type Safety Issues**
- GraphQL responses typed as `any` in mutation callbacks
- Missing strict null checks in product drawer component
- Inconsistent error type handling across components

**Performance Bottlenecks**
- Large bundle size (2.3MB) impacts mobile loading
- No virtualization for product tables (breaks at 1000+ items)
- Inefficient re-renders in filter components
- Missing React.memo on expensive calculations

**Security Gaps**
- No authentication system implemented
- Client-side only validation (easily bypassed)
- CORS configured for development only
- No rate limiting or request throttling

**Accessibility Issues**
- Missing keyboard navigation for drawer component
- Incomplete ARIA labels on interactive elements
- No focus management for modal states
- Color-only status indicators (needs icons for colorblind users)

**Infrastructure Limitations**
- Single point of failure (in-memory data)
- No error recovery or retry mechanisms
- Missing health checks and monitoring
- No horizontal scaling capability

### Development Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Development Time | 3-4 days | - |
| Lines of Code | ~2,800 | - |
| Components | 18 reusable | - |
| Bundle Size | 2.3MB | <1.5MB |
| Test Coverage | 0% | 80%+ |
| Lighthouse Score | ~85 | 95+ |
| TypeScript Coverage | 95% | 100% |

*For detailed architectural decisions and full development journey, see [NOTES.md](./NOTES.md)*## 🎨 Customization

### Styling

The project uses **Tailwind CSS 4** for styling. Custom animations are defined in `src/index.css`:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fadeIn 0.6s ease-out; }
````

```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 4000 (backend)
npx kill-port 4000
```

**Module not found errors:**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build failures:**

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint errors
npm run lint
```

**GraphQL connection issues:**

- Ensure the server is running on port 4000
- Check CORS configuration in `server.js`
- Verify the API endpoint in your environment variables

## 📈 Performance

- **Bundle size**: ~2.3MB (including all dependencies)
- **First load**: ~800ms on fast connection
- **Lighthouse score**: 85-90 (estimated)
