# SkillKode Development Setup & Deployment Guide

## Overview

This guide covers the complete development workflow for SkillKode, from initial setup to production deployment. It includes environment configuration, development best practices, testing strategies, and deployment procedures.

---

## Prerequisites

### System Requirements

**Minimum Requirements**:
- Node.js 18.0+ (recommended 20.x)
- npm 9.0+ or yarn 1.22+
- Git 2.30+
- Modern web browser (Chrome 100+, Firefox 100+, Safari 15+)

**Recommended Development Setup**:
- 8GB+ RAM
- Multi-core processor
- SSD storage
- 1920x1080+ resolution monitor

### Development Tools

**Essential Tools**:
- **VS Code**: Recommended IDE with extensions
- **Chrome DevTools**: For debugging and profiling
- **React Developer Tools**: Browser extension
- **Postman**: For API testing (if applicable)

**Optional Tools**:
- **Storybook**: For component development
- **ESLint**: Code quality and style
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality control

---

## Initial Setup

### Repository Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd levelup-lite
   ```

2. **Verify Branch Structure**
   ```bash
   git branch -a
   git checkout main  # or develop
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Configuration

1. **Create Environment Files**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Environment Variables**
   ```env
   # .env.local
   VITE_APP_TITLE=LevelUp Lite
   VITE_APP_VERSION=3.0.0
   VITE_API_BASE_URL=http://localhost:3000
   VITE_ENABLE_DEBUG=true
   ```

3. **Verify Configuration**
   ```bash
   npm run env:check  # if available
   ```

### Development Server Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Verify Server**
   - Open `http://localhost:5173`
   - Check all pages load correctly
   - Verify console for errors

3. **Hot Module Replacement**
   - Verify HMR is working
   - Test component changes
   - Check CSS updates

---

## Development Workflow

### Branch Strategy

**Git Flow Model**:
```
main (production)
├── develop (integration)
├── feature/feature-name
├── hotfix/bug-fix
└── release/version-number
```

**Branch Naming Conventions**:
- `feature/feature-name`: New features
- `bugfix/issue-description`: Bug fixes
- `hotfix/urgent-fix`: Critical fixes
- `release/v1.2.3`: Release preparation

### Commit Standards

**Conventional Commits**:
```
type(scope): description

feat(arena): add new AI opponent
fix(login): resolve authentication issue
docs(readme): update installation guide
style(css): improve button hover effects
refactor(store): optimize state management
test(quiz): add unit tests for quiz component
chore(deps): update dependencies
```

**Commit Message Guidelines**:
- Use present tense ("add" not "added")
- Be descriptive but concise
- Reference issue numbers when applicable
- Keep first line under 72 characters

### Code Quality

**ESLint Configuration**:
```javascript
// eslint.config.js
export default [
  {
    ignores: ['dist', 'node_modules']
  },
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'error',
      'prefer-const': 'error'
    }
  }
];
```

**Prettier Configuration**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**Pre-commit Hooks**:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  }
}
```

---

## Project Structure

### Directory Organization

```
levelup-lite/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Basic UI components
│   │   └── [component].jsx
│   ├── pages/            # Page-level components
│   ├── context/          # React contexts
│   ├── data/             # Static data files
│   ├── utils/            # Utility functions
│   ├── assets/           # Component assets
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── docs/                 # Documentation
├── tests/                # Test files
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── README.md            # Project overview
```

### File Naming Conventions

**Components**:
- PascalCase: `UserProfile.jsx`, `ProgressBar.jsx`
- Folder with index: `components/UserProfile/index.jsx`

**Utilities**:
- camelCase: `storage.js`, `audioEngine.js`
- Descriptive names: `formatCurrency.js`

**Data Files**:
- kebab-case: `missions.json`, `questions.json`

**CSS Files**:
- Component-specific: `ProgressBar.css`
- Global styles: `index.css`, `App.css`

---

## Development Tools

### Package Scripts

**Available Scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

**Development Workflow**:
```bash
# Start development
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm run test

# Start Storybook
npm run storybook
```

### VS Code Configuration

**Recommended Extensions**:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

**Workspace Settings**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

---

## Testing Strategy

### Test Types

**Unit Tests**:
- Component rendering
- Function behavior
- State management
- Utility functions

**Integration Tests**:
- Component interactions
- Data flow
- User workflows
- API integration

**End-to-End Tests**:
- Full user journeys
- Cross-browser compatibility
- Performance testing
- Accessibility testing

### Testing Setup

**Vitest Configuration**:
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
});
```

**Test Structure**:
```
tests/
├── setup.js              # Test configuration
├── components/           # Component tests
│   ├── ProgressBar.test.js
│   └── Sidebar.test.js
├── pages/               # Page tests
│   ├── Dashboard.test.js
│   └── Login.test.js
├── utils/               # Utility tests
│   ├── storage.test.js
│   └── audioEngine.test.js
└── e2e/                 # End-to-end tests
    ├── login.spec.js
    └── missions.spec.js
```

### Example Tests

**Component Test**:
```javascript
// tests/components/ProgressBar.test.js
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../../src/components/ProgressBar';

describe('ProgressBar', () => {
  it('renders with correct progress', () => {
    render(<ProgressBar progress={50} color="blue" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle('width: 50%');
  });

  it('displays percentage text', () => {
    render(<ProgressBar progress={75} showText />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
```

**Utility Test**:
```javascript
// tests/utils/storage.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { saveUserData, loadUserData } from '../../src/utils/storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads user data', () => {
    const userData = { username: 'test', level: 5 };
    saveUserData(userData);
    const loaded = loadUserData();
    expect(loaded).toEqual(userData);
  });
});
```

---

## Performance Optimization

### Build Optimization

**Vite Configuration**:
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts']
        }
      }
    },
    minify: 'terser',
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true
  }
});
```

### Code Splitting

**Dynamic Imports**:
```javascript
// Lazy load heavy components
const Arena = lazy(() => import('./pages/Arena'));
const SkillTree = lazy(() => import('./pages/SkillTree'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Arena />
</Suspense>
```

**Route-based Splitting**:
```javascript
// Automatic with React Router v6
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'dashboard',
        lazy: () => import('./pages/Dashboard')
      }
    ]
  }
]);
```

### Performance Monitoring

**Development Tools**:
```javascript
// Performance monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

**Bundle Analysis**:
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

---

## Deployment

### Build Process

**Production Build**:
```bash
# Clean build
npm run build

# Preview build
npm run preview

# Build with analysis
npm run build -- --analyze
```

**Build Optimization**:
- Minification and compression
- Tree shaking for unused code
- Asset optimization
- Source map generation

### Static Deployment

**Vercel**:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

**Netlify**:
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**GitHub Pages**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Environment Configuration

**Production Variables**:
```env
# Production
VITE_APP_TITLE=LevelUp Lite
VITE_APP_VERSION=3.0.0
VITE_API_BASE_URL=https://api.levelup-lite.com
VITE_ENABLE_DEBUG=false
VITE_SENTRY_DSN=your-sentry-dsn
```

**Staging Variables**:
```env
# Staging
VITE_APP_TITLE=LevelUp Lite (Staging)
VITE_APP_VERSION=3.0.0-staging
VITE_API_BASE_URL=https://staging-api.levelup-lite.com
VITE_ENABLE_DEBUG=true
```

### CI/CD Pipeline

**GitHub Actions Workflow**:
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Monitoring & Analytics

### Error Tracking

**Sentry Integration**:
```javascript
// src/utils/sentry.js
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE
  });
}
```

### Performance Monitoring

**Web Vitals**:
```javascript
// src/utils/analytics.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### User Analytics

**Google Analytics**:
```javascript
// src/utils/analytics.js
import { GA_TRACKING_ID } from './config';

export function trackPageView(path) {
  gtag('config', GA_TRACKING_ID, {
    page_path: path
  });
}

export function trackEvent(action, category, label) {
  gtag('event', action, {
    event_category: category,
    event_label: label
  });
}
```

---

## Security Considerations

### Content Security Policy

**CSP Header**:
```javascript
// vite.config.js
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data:;
        connect-src 'self';
        font-src 'self';
      `.replace(/\s+/g, ' ').trim()
    }
  }
});
```

### Dependency Security

**Security Audit**:
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

**Automated Security Scanning**:
```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit --audit-level high
```

---

## Troubleshooting

### Common Development Issues

**Build Failures**:
```bash
# Clear cache
rm -rf node_modules dist
npm install

# Check Vite config
npm run vite --debug

# Verify dependencies
npm ls
```

**Hot Module Replacement Issues**:
```bash
# Restart dev server
npm run dev -- --force

# Check file watchers
npm run dev -- --watch
```

**CSS Issues**:
```bash
# Verify Tailwind build
npx tailwindcss -i ./src/index.css -o ./dist/output.css

# Check PostCSS config
npx postcss src/index.css -o dist/test.css
```

### Performance Issues

**Bundle Size Analysis**:
```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist

# Check for large dependencies
npx webpack-bundle-analyzer dist/stats.json
```

**Memory Leaks**:
```javascript
// Check for memory leaks in dev tools
// Use Performance tab to profile memory usage
// Look for detached DOM nodes
```

### Deployment Issues

**Build Errors**:
```bash
# Test production build locally
npm run build
npm run preview

# Check environment variables
npm run build -- --mode production
```

**Routing Issues**:
```bash
# Verify SPA routing
# Check server configuration for fallback to index.html
# Test 404 handling
```

---

## Best Practices

### Code Organization

**Component Structure**:
```javascript
// Component template
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default ComponentName;
```

**State Management**:
```javascript
// Context provider pattern
import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  
  const value = {
    state,
    setState,
    actions: {
      // Action functions
    }
  };
  
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};
```

### Performance Best Practices

**React Optimization**:
```javascript
// Use React.memo for pure components
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback((id) => {
  onItemClick(id);
}, [onItemClick]);
```

**CSS Optimization**:
```css
/* Use CSS variables for theming */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
}

/* Optimize animations */
.animated-element {
  will-change: transform;
  transform: translateZ(0);
}
```

### Accessibility

**ARIA Labels**:
```jsx
<button
  aria-label="Close modal"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  ×
</button>
```

**Keyboard Navigation**:
```jsx
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    handleClose();
  }
};

<div onKeyDown={handleKeyDown} tabIndex={0}>
  {/* Content */}
</div>
```

---

## Maintenance

### Regular Tasks

**Weekly**:
- Update dependencies
- Review security advisories
- Check build performance
- Update documentation

**Monthly**:
- Major dependency updates
- Performance audits
- Accessibility testing
- Code refactoring

**Quarterly**:
- Architecture review
- Technology assessment
- User feedback analysis
- Feature planning

### Dependency Management

**Update Strategy**:
```bash
# Check for updates
npm outdated

# Update patch versions
npm update

# Update minor versions
npm update package

# Update major versions (carefully)
npm install package@latest
```

**Automated Updates**:
```yaml
# .github/workflows/updates.yml
name: Dependency Updates
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm update
      - run: npm test
      - uses: peter-evans/create-pull-request@v3
        with:
          title: 'Automated dependency updates'
          body: 'Automated dependency updates'
```

---

## Conclusion

This development setup provides a comprehensive foundation for building, testing, and deploying LevelUp Lite. Following these guidelines ensures:

- **Code Quality**: Consistent, maintainable code
- **Performance**: Optimized builds and runtime
- **Security**: Protected against common vulnerabilities
- **Reliability**: Thorough testing and monitoring
- **Scalability**: Architecture that grows with the project

Regular maintenance and updates to these practices will keep the development environment efficient and the application robust.
