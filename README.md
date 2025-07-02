# 🎯 ATScribe

## AI-Powered Resume Builder for the Modern Professional

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> A comprehensive, production-ready MERN stack application for creating ATS-optimized resumes using AI technology.

**[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-api-documentation) • [🤝 Contributing](#-contributing) • [📊 Live Demo](https://atscribe.vercel.app)**

---

## 🚀 Features

### 🎯 Core Functionality

- **AI-Powered Resume Optimization** - Generate ATS-compliant content using Google Gemini
- **Multi-Step Resume Builder** - Intuitive form with validation and progress tracking  
- **Real-time AI Chat** - Interactive assistance for resume improvement
- **PDF Export** - Professional templates with multiple styling options
- **Resume Management** - Create, edit, delete, and organize multiple resumes

### ⚡ Technical Excellence

- **Production-Ready Architecture** - Scalable MERN stack with TypeScript
- **Comprehensive Testing** - Unit, integration, and E2E tests with 70%+ coverage
- **Security First** - Rate limiting, input validation, CSRF protection, security headers
- **Performance Optimized** - Code splitting, lazy loading, efficient caching
- **Monitoring & Logging** - Structured logging with Winston, error tracking with Sentry
- **CI/CD Pipeline** - Automated testing, security scanning, and deployment

## 🏗️ Architecture

```
📁 Project Structure
├── 📂 app/                    # Next.js App Router
│   ├── 🔌 api/               # API routes with validation & rate limiting
│   ├── 📊 dashboard/         # Dashboard pages
│   └── 📄 resume/           # Resume builder pages
├── 🧩 components/            # Reusable UI components
│   ├── 🎨 ui/               # Base UI components (shadcn/ui)
│   ├── 📝 forms/            # Form components with validation
│   └── 🔄 providers/        # Context providers
├── 📚 lib/                  # Core utilities and services
│   ├── ⚙️ config/           # Configuration (database, etc.)
│   ├── 🗃️ models/           # MongoDB/Mongoose models
│   ├── 🔧 services/         # Business logic services
│   ├── 🛠️ utils/            # Utility functions
│   └── 🔒 middleware/       # Custom middleware
├── 🏪 store/                # Zustand state management
├── 🎣 hooks/                # Custom React hooks
├── 📋 types/                # TypeScript type definitions
└── 🧪 **tests**/            # Test files
```

## 🛠️ Technology Stack

## 🛠️ Technology Stack

### 🎨 Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and developer experience  
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching

### ⚙️ Backend

- **Node.js** - Runtime environment
- **MongoDB** - Document database with Mongoose ODM
- **Clerk** - Authentication and user management
- **AI SDK** - Google Gemini integration for AI features

### 🚀 DevOps & Quality

- **Docker** - Containerization with multi-stage builds
- **GitHub Actions** - CI/CD pipeline
- **Jest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **ESLint/Prettier** - Code quality and formatting

---

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Clerk account for authentication  
- Google AI API key

### 🛠️ Installation

**1. Clone the repository**

```bash
git clone <https://github.com/your-org/atscribe.git>
cd atscribe
```

**2. Install dependencies**

```bash
npm install
```

**3. Environment setup**

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Clerk Authentication  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**4. Run development server**

```bash
npm run dev
```

**5. Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

### 🏃‍♂️ Run Tests

| Test Type | Command | Description |
|-----------|---------|-------------|
| **Unit Tests** | `npm test` | Component and utility function testing |
| **E2E Tests** | `npm run test:e2e` | Full user journey testing with Playwright |
| **Coverage** | `npm run test:coverage` | Generate coverage report |

### 🎯 Test Strategy

- **Unit Tests** - Component and utility function testing
- **Integration Tests** - API route testing  
- **E2E Tests** - Full user journey testing with Playwright
- **Coverage Target** - 70%+ code coverage maintained

---

## 🐳 Docker Deployment

### 🔧 Development

```bash
docker-compose up --build
```

### 🚀 Production

```bash
# Build production image
docker build -t atscribe .

# Run with environment variables
docker run -p 3000:3000 \
  -e MONGODB_URI=your_uri \
  -e CLERK_SECRET_KEY=your_key \
  atscribe
```

---

## 🌐 Production Deployment

### ⚡ Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard  
3. Deploy automatically on push to main branch

### 🔧 Manual Deployment

1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (Nginx) for SSL and load balancing

---

## 🔒 Security Features

### 🛡️ Implemented Security Measures

- **Rate Limiting** - API endpoint protection
- **Input Validation** - Zod schema validation
- **CSRF Protection** - Cross-site request forgery prevention
- **Security Headers** - XSS, clickjacking, and content-type protection
- **Content Security Policy** - Script injection prevention  
- **Dependency Scanning** - Automated vulnerability detection

### ✅ Security Checklist

- [x] Authentication with Clerk
- [x] API rate limiting
- [x] Input sanitization and validation
- [x] Security headers implementation
- [x] HTTPS enforcement (production)
- [x] Dependency vulnerability scanning
- [x] Error handling without information leakage

---

## 📊 Monitoring & Analytics

### 🔧 Integrated Services

- **Vercel Analytics** - Performance and usage metrics
- **Sentry** - Error tracking and performance monitoring
- **Winston Logging** - Structured application logging
- **Health Checks** - Application and database status monitoring

### 📈 Key Metrics Tracked

- API response times
- Error rates and types
- User engagement metrics
- Database performance
- Security incidents

---

## 🔧 Configuration

### 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ Yes |
| `SENTRY_DSN` | Sentry error tracking | ❌ No |

### 🚩 Feature Flags

Configure features through environment variables:

- `ENABLE_AI_FEATURES` - Enable/disable AI functionality
- `ENABLE_ANALYTICS` - Enable/disable analytics tracking  
- `MAINTENANCE_MODE` - Enable maintenance mode

---

## 🤝 Contributing

### 🔄 Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with tests
4. **Run** quality checks: `npm run lint && npm test`
5. **Commit** with conventional commits: `git commit -m "feat: add amazing feature"`
6. **Push** and create a Pull Request

### ⚡ Code Quality Standards

- ✅ TypeScript strict mode enabled
- ✅ ESLint and Prettier configuration
- ✅ 70%+ test coverage requirement
- ✅ Security vulnerability scanning
- ✅ Performance budget enforcement

---

## 📈 Performance Optimization

### ⚡ Implemented Optimizations

- **Code Splitting** - Dynamic imports for route-based splitting
- **Image Optimization** - Next.js Image component with WebP support
- **Caching Strategy** - React Query for server state, browser caching for static assets
- **Bundle Analysis** - Webpack bundle analyzer integration
- **Database Indexing** - Optimized MongoDB queries with proper indexes

### 🎯 Performance Metrics

- **Lighthouse Score** - 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint** - <1.5s
- **Time to Interactive** - <3s
- **Core Web Vitals** - All green ✅

---

## 📚 API Documentation

### 🔐 Authentication

All API endpoints require authentication via Clerk. Include the session token in requests.

### ⏱️ Rate Limits

- **General API** - 100 requests per 15 minutes
- **AI endpoints** - 10 requests per hour
- **File uploads** - 20 requests per hour

### 🛠️ Key Endpoints

- `GET /api/resumes` - List user resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/ai/optimize` - AI resume optimization
- `POST /api/ai/chat` - AI chat assistance

---

## 🆘 Troubleshooting

### 🤖 API Quota Issues

If you encounter "API quota exceeded" errors when generating AI content:

#### 🔍 Understanding the Error

- **Quota Limit** - Google Gemini API has free tier limits (15 requests per minute, 1500 requests per day)
- **Rate Limiting** - The API enforces rate limits to prevent abuse
- **Model Differences** - `gemini-1.5-pro` has stricter limits than `gemini-1.5-flash`

#### 💡 Solutions

1. **Wait and Retry** - The error message includes a `retryAfter` time
2. **Automatic Fallback** - The app automatically tries `gemini-1.5-flash` if `gemini-1.5-pro` fails
3. **Upgrade Your Plan** - Visit [Google AI Studio](https://ai.google.dev/) for higher quotas
4. **Optimize API Usage** - Built-in optimizations include automatic retry and model fallback

#### ⚙️ Configuration Options

You can modify AI behavior in `lib/config/ai.ts`:

```typescript
export const AI_CONFIG = {
  PRIMARY_MODEL: "gemini-1.5-pro",    // High quality, lower quota
  FALLBACK_MODEL: "gemini-1.5-flash", // Faster, higher quota
  MAX_RETRIES: 3,
  DEFAULT_RETRY_AFTER: 60, // seconds
}
```

### 🔧 Common Issues

#### 🗄️ Database Connection

```bash
# Check MongoDB connection
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/atscribe
```

#### 🔐 Authentication Issues

```bash
# Verify Clerk keys in .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### 🏗️ Build Issues

```bash
# Clear cache and rebuild
pnpm clean
pnpm install
pnpm build
```

---

<div align="center">

## 🎯 ATScribe

**Empowering careers with AI-driven resume optimization**

Made with ❤️ by [Koustav Singh](https://koustavx08.vercel.app)

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-org/atscribe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>
