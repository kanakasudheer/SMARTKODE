# SkillKode Technical Architecture Overview

## System Architecture

SkillKode is built as a modern single-page application (SPA) using React 18 with a component-based architecture. The system follows a layered approach with clear separation of concerns between presentation, business logic, and data management.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Pages     │ │ Components  │ │    UI       │ │ Effects │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Context   │ │   Hooks     │ │  Utils      │ │ Rules   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ LocalStorage│ │    JSON     │ │   State     │ │ Cache   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Technologies

### Frontend Framework

**React 18.2.4**
- Functional components with hooks
- Concurrent features (Suspense, Transitions)
- Automatic batching
- Strict mode for development

**Key React Features Used**:
- `useState`, `useEffect`, `useContext`
- `useMemo`, `useCallback` for optimization
- `Suspense` for lazy loading
- Concurrent rendering capabilities

### Build Tool & Development

**Vite 8.0.1**
- Lightning-fast HMR (Hot Module Replacement)
- Optimized development server
- ES modules native support
- Plugin ecosystem

**Vite Configuration**:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          graphics: ['ogl', 'recharts']
        }
      }
    }
  }
});
```

### Styling System

**Tailwind CSS 3.4.19**
- Utility-first CSS framework
- Custom design system
- Responsive design utilities
- Dark mode support

**Custom CSS Features**:
- CSS custom properties for theming
- CSS animations and transitions
- Glassmorphism effects
- CRT display simulation

### Animation & Graphics

**Framer Motion 12.38.0**
- Declarative animations
- Spring physics
- Gesture handling
- Layout animations

**OGL 1.0.11 (WebGL)**
- Hardware-accelerated graphics
- Custom shader effects
- 3D transformations
- Particle systems

**Recharts 3.8.0**
- Data visualization
- Interactive charts
- Custom styling
- Responsive design

---

## Component Architecture

### Component Hierarchy

```
App (Root)
├── UserProvider (Context)
├── Router (React Router)
└── AppRoutes
    ├── Global Components
    │   ├── TrophyToast
    │   ├── HackerTerminal
    │   ├── HackerConsole
    │   └── PrismaticBurst
    ├── Layout Components
    │   └── Sidebar
    └── Page Components
        ├── Dashboard
        ├── Missions
        ├── Quiz
        ├── Arena
        ├── Leaderboard
        ├── Profile
        ├── Store
        ├── SkillTree
        └── TrophyGallery
```

### Component Patterns

**Container/Presentation Pattern**:
```javascript
// Container Component (logic)
const DashboardContainer = () => {
  const { user, addXP } = useContext(UserContext);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    // Data fetching logic
  }, []);
  
  return <Dashboard stats={stats} user={user} />;
};

// Presentation Component (UI)
const Dashboard = ({ stats, user }) => {
  return (
    <div className="dashboard">
      {/* UI rendering */}
    </div>
  );
};
```

**Compound Component Pattern**:
```javascript
const SkillTree = ({ children }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  return (
    <SkillTreeContext.Provider value={{ selectedSkill, setSelectedSkill }}>
      <div className="skill-tree">
        {children}
      </div>
    </SkillTreeContext.Provider>
  );
};

SkillTree.Node = ({ skill, children }) => {
  // Node implementation
};

SkillTree.Connection = ({ from, to }) => {
  // Connection implementation
};
```

**Higher-Order Component Pattern**:
```javascript
const withAuth = (Component) => {
  return (props) => {
    const { user } = useContext(UserContext);
    
    if (!user.isLoggedIn) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
};

// Usage
const ProtectedProfile = withAuth(Profile);
```

---

## State Management Architecture

### Global State (Context API)

**UserContext Structure**:
```javascript
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserState);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  
  // State management logic
  const actions = {
    loginUser, logoutUser, addXP, addCurrency,
    completeMission, unlockBadge, purchaseItem,
    equipColor, toggleCRTMode, unlockSkill,
    damageBoss
  };
  
  return (
    <UserContext.Provider value={{ user, leveledUp, newBadge, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};
```

**State Update Patterns**:
```javascript
// Immutable updates with spread operator
const addXP = (amount) => {
  setUser(prev => {
    const multiplier = prev.skills.includes('xp_buff') ? 1.25 : 1;
    const boostedAmount = Math.round(amount * multiplier);
    const newXp = prev.xp + boostedAmount;
    const newLevel = Math.floor(newXp / 500) + 1;
    
    return { 
      ...prev, 
      xp: newXp, 
      level: newLevel,
      skillPoints: newLevel > prev.level ? prev.skillPoints + 1 : prev.skillPoints 
    };
  });
};
```

### Local State Management

**Component-Level State**:
```javascript
const Arena = () => {
  const [battleState, setBattleState] = useState({
    opponent: null,
    currentQuestion: null,
    score: 0,
    timeRemaining: 30,
    combo: 0
  });
  
  const [uiState, setUiState] = useState({
    showResult: false,
    isLoading: false,
    error: null
  });
  
  // Component logic
};
```

**Derived State**:
```javascript
const Dashboard = () => {
  const { user } = useContext(UserContext);
  
  // Derived calculations
  const xpProgress = useMemo(() => {
    const xpForNextLevel = user.level * 500;
    const currentLevelXp = (user.level - 1) * 500;
    return ((user.xp - currentLevelXp) / (xpForNextLevel - currentLevelXp)) * 100;
  }, [user.xp, user.level]);
  
  const completionRate = useMemo(() => {
    const totalMissions = missions.length;
    const completedMissions = user.completedMissions.length;
    return (completedMissions / totalMissions) * 100;
  }, [user.completedMissions]);
};
```

---

## Data Flow Architecture

### Unidirectional Data Flow

```
User Action → Component Event → Context Action → State Update → Re-render
```

**Example Flow**:
1. User clicks "Complete Mission" button
2. Button calls `completeMission(missionId)`
3. Context function updates user state
4. State change triggers component re-renders
5. UI reflects updated progress

### Data Persistence Strategy

**LocalStorage Integration**:
```javascript
// Storage utility
export const saveUserData = (userData) => {
  try {
    localStorage.setItem('levelup-lite-user', JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

export const loadUserData = () => {
  try {
    const saved = localStorage.getItem('levelup-lite-user');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load user data:', error);
    return null;
  }
};
```

**State Synchronization**:
```javascript
// Auto-save on state changes
useEffect(() => {
  saveUserData(user);
}, [user]);

// Load on app start
const [user, setUser] = useState(() => {
  const saved = loadUserData();
  return { ...initializeUser(), ...saved };
});
```

---

## Routing Architecture

### Client-Side Routing

**React Router v6 Implementation**:
```javascript
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/quiz/:id" element={<Quiz />} />
      <Route path="/arena" element={<Arena />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/store" element={<Store />} />
      <Route path="/skills" element={<SkillTree />} />
      <Route path="/gallery" element={<TrophyGallery />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
```

### Route Protection

**Authentication Guard**:
```javascript
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  
  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Dynamic Routing

**Parameterized Routes**:
```javascript
const Quiz = () => {
  const { id } = useParams();
  const { user, completeMission } = useContext(UserContext);
  
  const mission = missions.find(m => m.id === id);
  const questions = questionData[id] || [];
  
  // Route-specific logic
};
```

---

## Performance Architecture

### Rendering Optimization

**React.memo Usage**:
```javascript
const ProgressBar = React.memo(({ progress, color, height }) => {
  return (
    <div className={`progress-bar ${color}`} style={{ height }}>
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

// Custom comparison for complex props
const Arena = React.memo(({ battleState }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.battleState.score === nextProps.battleState.score;
});
```

**Memoization Strategies**:
```javascript
// Expensive calculations
const processedLeaderboard = useMemo(() => {
  return leaderboard
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10)
    .map((user, index) => ({ ...user, rank: index + 1 }));
}, [leaderboard]);

// Stable function references
const handleAnswerSelect = useCallback((answer) => {
  setSelectedAnswer(answer);
  setTimeRemaining(prev => Math.max(0, prev - 1));
}, []);
```

### Code Splitting

**Lazy Loading Implementation**:
```javascript
// Route-based splitting
const Arena = lazy(() => import('./pages/Arena'));
const SkillTree = lazy(() => import('./pages/SkillTree'));

// Component-based splitting
const PrismaticBurst = lazy(() => import('./components/PrismaticBurst'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Arena />
</Suspense>
```

**Bundle Optimization**:
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          graphics: ['ogl', 'recharts'],
          utils: ['./utils/storage', './utils/audioEngine']
        }
      }
    }
  }
});
```

### Memory Management

**Cleanup Patterns**:
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setTimeRemaining(prev => prev - 1);
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);

useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      setShowTerminal(false);
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

**Resource Management**:
```javascript
// WebGL resource cleanup
useEffect(() => {
  const gl = new OGL.Renderer({ canvas });
  const geometry = new OGL.BoxGeometry();
  const mesh = new OGL.Mesh(gl, { geometry });
  
  return () => {
    geometry.dispose();
    mesh.dispose();
    gl.dispose();
  };
}, []);
```

---

## Security Architecture

### Client-Side Security

**Input Validation**:
```javascript
const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 100); // Limit length
};

const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};
```

**XSS Prevention**:
```javascript
// React's built-in XSS protection
const renderUserContent = (content) => {
  return <div>{content}</div>; // Automatically escaped
};

// For dynamic HTML (use with caution)
const SafeHTML = ({ html }) => {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

### Data Protection

**LocalStorage Security**:
```javascript
const secureStorage = {
  set: (key, value) => {
    const encrypted = btoa(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
  },
  
  get: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      return JSON.parse(atob(encrypted));
    } catch {
      return null;
    }
  }
};
```

**Data Validation**:
```javascript
const validateUserData = (data) => {
  const schema = {
    username: (val) => typeof val === 'string' && val.length >= 3,
    level: (val) => typeof val === 'number' && val >= 1,
    xp: (val) => typeof val === 'number' && val >= 0,
    currency: (val) => typeof val === 'number' && val >= 0
  };
  
  return Object.entries(schema).every(([key, validator]) => {
    return validator(data[key]);
  });
};
```

---

## Testing Architecture

### Testing Pyramid

```
    E2E Tests (Few)
   ┌─────────────────┐
  │  Integration     │
 │    Tests         │
│   (Some)          │
│                   │
│  Unit Tests       │
│   (Many)          │
└───────────────────┘
```

### Unit Testing Strategy

**Component Testing**:
```javascript
describe('ProgressBar', () => {
  it('renders correct progress percentage', () => {
    render(<ProgressBar progress={50} />);
    const fill = screen.getByRole('progressbar');
    expect(fill).toHaveStyle('width: 50%');
  });
  
  it('applies correct color class', () => {
    render(<ProgressBar progress={75} color="blue" />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress-bar-blue');
  });
});
```

**Hook Testing**:
```javascript
describe('useUserProgress', () => {
  it('calculates correct XP progress', () => {
    const { result } = renderHook(() => useUserProgress({
      level: 5,
      xp: 1200
    }));
    
    expect(result.current.progress).toBe(40);
  });
});
```

### Integration Testing

**Context Integration**:
```javascript
describe('UserContext Integration', () => {
  it('updates XP and level correctly', async () => {
    const { result } = renderHook(() => useUserContext(), {
      wrapper: UserProvider
    });
    
    act(() => {
      result.current.addXP(500);
    });
    
    expect(result.current.user.level).toBe(2);
    expect(result.current.user.xp).toBe(500);
  });
});
```

### E2E Testing

**User Journey Testing**:
```javascript
describe('Complete Mission Flow', () => {
  it('allows user to complete a mission and earn XP', () => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="login-button"]').click();
    
    cy.visit('/missions');
    cy.get('[data-testid="mission-m1"]').click();
    
    // Complete quiz questions
    cy.get('[data-testid="answer-option"]').first().click();
    cy.get('[data-testid="submit-answer"]').click();
    
    // Verify XP earned
    cy.get('[data-testid="user-xp"]').should('contain', '150');
  });
});
```

---

## Deployment Architecture

### Build Process

**Production Build Pipeline**:
```
Source Code → Vite Build → Bundle Analysis → Optimization → Deployment
```

**Build Configuration**:
```javascript
// vite.config.js
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Static Site Deployment

**Vercel Configuration**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite",
  "functions": {},
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Netlify Configuration**:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### CDN Strategy

**Asset Optimization**:
```javascript
// Asset versioning
const assetVersion = Date.now();
const assetPath = `/assets/v${assetVersion}/`;

// Preload critical assets
const preloadAssets = [
  '/fonts/main.woff2',
  '/images/logo.svg',
  '/scripts/main.js'
];
```

---

## Monitoring & Analytics

### Performance Monitoring

**Web Vitals Tracking**:
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
```

**Error Tracking**:
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});

// React error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('React error:', error, errorInfo);
    // Send to error tracking service
  }
}
```

### User Analytics

**Event Tracking**:
```javascript
const analytics = {
  track: (event, properties) => {
    // Send to analytics service
    console.log('Event:', event, properties);
  },
  
  page: (path) => {
    // Track page view
    console.log('Page view:', path);
  }
};

// Usage in components
useEffect(() => {
  analytics.page(location.pathname);
}, [location.pathname]);
```

---

## Future Architecture Considerations

### Scalability

**Micro-Frontend Architecture**:
- Module federation for team independence
- Shared component library
- Independent deployment cycles

**State Management Evolution**:
- Consider Redux Toolkit for complex state
- Implement state persistence strategies
- Add offline capabilities

### Performance Enhancements

**Web Workers**:
- Background processing for calculations
- Audio processing in worker threads
- Data synchronization

**Service Workers**:
- Offline functionality
- Background sync
- Cache strategies

### Advanced Features

**Real-time Features**:
- WebSocket integration
- Live leaderboards
- Multiplayer arena

**AI Integration**:
- Personalized difficulty
- Adaptive learning paths
- Smart recommendations

---

## Conclusion

The technical architecture of LevelUp Lite is designed to be:

**Scalable**: Component-based architecture allows for easy expansion
**Performant**: Optimized rendering and resource management
**Maintainable**: Clear separation of concerns and patterns
**Secure**: Client-side security best practices
**Testable**: Comprehensive testing strategy

This architecture provides a solid foundation for current features while allowing for future growth and enhancement. The modular design ensures that new features can be added without disrupting existing functionality, and the performance optimizations ensure a smooth user experience across all devices.
