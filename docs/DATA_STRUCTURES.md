# SkillKode Data Structures & State Management Documentation

## Overview

SkillKode uses a sophisticated state management system built on React's Context API combined with localStorage for persistence. This document details all data structures, state management patterns, and data flow throughout the application.

---

## Core Data Structures

### User State Object

The central user state contains all player data and preferences:

```javascript
const userState = {
  // Identity
  username: string,              // Player's chosen name
  avatar: string,                // Selected avatar identifier
  isLoggedIn: boolean,           // Authentication status
  
  // Progression
  xp: number,                   // Current experience points
  level: number,                // Current player level
  skillPoints: number,          // Available skill points
  streak: number,               // Daily login streak
  
  // Economy
  currency: number,             // Credits balance
  shopPurchases: array,        // Purchased item IDs
  
  // Achievements
  badges: array,                // Earned badge IDs
  completedMissions: array,     // Completed mission IDs
  weakTopics: array,            // Topics needing improvement
  
  // Skills & Abilities
  skills: array,                // Active skill IDs
  
  // Game State
  bossHealth: number,           // Current raid boss health
  lastActiveDate: string,       // Last login date
  lastLootDate: string,         // Last loot collection date
  
  // Preferences
  activeColor: string,          // Current theme color
  crtMode: boolean,             // CRT display mode
  dataShopUnlocked: boolean,    // Secret shop access
  atmosphere: string            // Current time-based theme
};
```

### Badge Definitions

Achievement system with predefined badges:

```javascript
const badgeDefinitions = {
  first_blood: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Complete your first interaction in the Arena.',
    icon: '🩸',
    rarity: 'common',
    category: 'progress'
  },
  combo_king: {
    id: 'combo_king',
    name: 'Combo King',
    description: 'Achieve a 3x Combo streak in a single quiz run.',
    icon: '🔥',
    rarity: 'rare',
    category: 'skill'
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer correctly with more than 12s remaining.',
    icon: '⚡',
    rarity: 'uncommon',
    category: 'skill'
  },
  boss_slayer: {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat the Frontend Gauntlet boss mission.',
    icon: '🐉',
    rarity: 'epic',
    category: 'achievement'
  },
  rich_hacker: {
    id: 'rich_hacker',
    name: 'Rich Hacker',
    description: 'Accumulate over 500 Credits.',
    icon: '💰',
    rarity: 'rare',
    category: 'economy'
  }
};
```

### Skill Definitions

Neural skill tree with passive abilities:

```javascript
const skillDefinitions = {
  xp_buff: {
    id: 'xp_buff',
    name: 'The Architect',
    description: 'Gain 25% more XP from all activities.',
    cost: 1,
    category: 'progression',
    effect: { type: 'multiplier', target: 'xp', value: 1.25 },
    prerequisites: [],
    icon: '🧠'
  },
  credit_buff: {
    id: 'credit_buff',
    name: 'Merchant Lord',
    description: 'Earn 50% more credits from all activities.',
    cost: 1,
    category: 'economy',
    effect: { type: 'multiplier', target: 'currency', value: 1.5 },
    prerequisites: [],
    icon: '💎'
  },
  critical_hit: {
    id: 'critical_hit',
    name: 'Precision Strike',
    description: 'Chance for critical hits in raid boss battles.',
    cost: 2,
    category: 'combat',
    effect: { type: 'chance', target: 'critical', value: 0.15 },
    prerequisites: ['xp_buff'],
    icon: '⚔️'
  },
  dark_web: {
    id: 'dark_web',
    name: 'Dark Web Access',
    description: 'Unlock the secret Terminal marketplace.',
    cost: 3,
    category: 'special',
    effect: { type: 'unlock', target: 'dataShop' },
    prerequisites: ['credit_buff', 'xp_buff'],
    icon: '🌐'
  }
};
```

---

## Mission Data Structure

### Mission Definition

```javascript
const missionStructure = {
  id: string,                   // Unique mission identifier
  title: string,                // Display title
  description: string,          // Mission description
  xpReward: number,             // XP reward amount
  topic: string,                // Technology topic
  difficulty: string,           // Easy/Medium/Hard/Boss
  prerequisites: array,         // Required mission IDs
  estimatedTime: number,        // Estimated completion time (minutes)
  tags: array,                  // Technology tags
  objectives: array            // Learning objectives
};
```

### Example Mission Data

```javascript
const exampleMission = {
  id: 'm1',
  title: 'React Foundations',
  description: 'Learn the basics of React components and JSX in this tutorial wave.',
  xpReward: 150,
  topic: 'React',
  difficulty: 'Easy',
  prerequisites: [],
  estimatedTime: 15,
  tags: ['react', 'jsx', 'components'],
  objectives: [
    'Understand JSX syntax',
    'Create functional components',
    'Pass props to components',
    'Handle basic events'
  ]
};
```

### Question Data Structure

```javascript
const questionStructure = {
  id: string,                   // Unique question ID
  text: string,                 // Question text
  options: array,               // Answer options
  correct: string,              // Correct answer
  explanation: string,          // Explanation of correct answer
  difficulty: number,           // 1-5 difficulty scale
  topic: string,                // Question topic
  type: string                  // multiple_choice, true_false, code_output
};
```

---

## State Management Architecture

### Context Provider Structure

```javascript
export const UserProvider = ({ children }) => {
  // Core state
  const [user, setUser] = useState(initialUserState);
  
  // UI state
  const [leveledUp, setLeveledUp] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  
  // Derived state calculations
  const derivedState = useMemo(() => {
    return {
      xpProgress: calculateXpProgress(user.xp, user.level),
      totalBadges: user.badges.length,
      completionRate: calculateCompletionRate(user.completedMissions),
      nextLevelXp: user.level * 500
    };
  }, [user]);
  
  // State actions
  const actions = {
    loginUser: (username, avatar) => { /* implementation */ },
    logoutUser: () => { /* implementation */ },
    addXP: (amount) => { /* implementation */ },
    addCurrency: (amount) => { /* implementation */ },
    completeMission: (missionId, topic) => { /* implementation */ },
    unlockBadge: (badgeId) => { /* implementation */ },
    purchaseItem: (itemId, cost, type) => { /* implementation */ },
    equipColor: (color) => { /* implementation */ },
    toggleCRTMode: () => { /* implementation */ },
    unlockSkill: (skillId, cost) => { /* implementation */ },
    damageBoss: (damage) => { /* implementation */ }
  };
  
  return (
    <UserContext.Provider value={{ user, ...derivedState, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};
```

### State Update Patterns

### Immutable Updates

All state updates follow immutable patterns:

```javascript
// Correct: Immutable update
const addXP = (amount) => {
  setUser(prev => {
    const multiplier = prev.skills.includes('xp_buff') ? 1.25 : 1;
    const boostedAmount = Math.round(amount * multiplier);
    const newXp = prev.xp + boostedAmount;
    const newLevel = Math.floor(newXp / 500) + 1;
    const leveled = newLevel > prev.level;
    
    if (leveled) {
      setLeveledUp(true);
      setTimeout(() => setLeveledUp(false), 5000);
    }
    
    return { 
      ...prev, 
      xp: newXp, 
      level: newLevel,
      skillPoints: leveled ? prev.skillPoints + 1 : prev.skillPoints 
    };
  });
};

// Incorrect: Direct mutation
const addXPWrong = (amount) => {
  user.xp += amount; // Don't do this!
  setUser(user);
};
```

### Batch Updates

Multiple related updates are batched:

```javascript
const completeMission = (missionId, topic) => {
  setUser(prev => {
    // Check if already completed
    if (prev.completedMissions.includes(missionId)) {
      return prev;
    }
    
    // Calculate streak
    const isNewDay = prev.lastActiveDate !== new Date().toDateString();
    const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
    
    // Remove from weak topics
    const updatedWeakTopics = prev.weakTopics.filter(t => t !== topic);
    
    return {
      ...prev,
      completedMissions: [...prev.completedMissions, missionId],
      streak: newStreak,
      lastActiveDate: new Date().toDateString(),
      weakTopics: updatedWeakTopics
    };
  });
  
  // Trigger badge checks
  unlockBadge('first_blood');
};
```

---

## Data Persistence

### Storage Strategy

**localStorage Integration**:
```javascript
// Storage utilities
export const storage = {
  // Save user data
  save: (userData) => {
    try {
      const serialized = JSON.stringify(userData);
      localStorage.setItem('levelup-lite-user', serialized);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },
  
  // Load user data
  load: () => {
    try {
      const serialized = localStorage.getItem('levelup-lite-user');
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  },
  
  // Clear all data
  clear: () => {
    try {
      localStorage.removeItem('levelup-lite-user');
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  },
  
  // Backup data
  backup: () => {
    const data = storage.load();
    if (data) {
      const backup = {
        timestamp: Date.now(),
        version: '3.0.0',
        data: data
      };
      const serialized = JSON.stringify(backup);
      localStorage.setItem('levelup-lite-backup', serialized);
    }
  },
  
  // Restore from backup
  restore: () => {
    try {
      const serialized = localStorage.getItem('levelup-lite-backup');
      if (serialized) {
        const backup = JSON.parse(serialized);
        storage.save(backup.data);
        return true;
      }
    } catch (error) {
      console.error('Failed to restore from backup:', error);
    }
    return false;
  }
};
```

### Auto-Save Implementation

```javascript
// Auto-save on state changes
useEffect(() => {
  storage.save(user);
}, [user]);

// Debounced save for frequent updates
const debouncedSave = useMemo(
  () => debounce(storage.save, 1000),
  []
);

useEffect(() => {
  debouncedSave(user);
  return () => debouncedSave.cancel();
}, [user, debouncedSave]);
```

### Data Migration

```javascript
// Migration system for data structure changes
const migrations = {
  '1.0.0': (data) => {
    // Add new fields
    return {
      ...data,
      skillPoints: data.skillPoints || 0,
      skills: data.skills || [],
      atmosphere: data.atmosphere || 'void'
    };
  },
  '2.0.0': (data) => {
    // Restructure badges
    return {
      ...data,
      badges: Array.isArray(data.badges) ? data.badges : [],
      shopPurchases: data.shopPurchases || []
    };
  }
};

export const migrateUserData = (userData, currentVersion) => {
  let migrated = { ...userData };
  const version = userData.version || '1.0.0';
  
  // Apply migrations in order
  Object.keys(migrations).forEach(migrationVersion => {
    if (compareVersions(version, migrationVersion) < 0) {
      migrated = migrations[migrationVersion](migrated);
    }
  });
  
  return { ...migrated, version: currentVersion };
};
```

---

## Derived State Calculations

### XP Progress Calculation

```javascript
const calculateXpProgress = (currentXp, level) => {
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  
  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));
};
```

### Completion Rate Calculation

```javascript
const calculateCompletionRate = (completedMissions, totalMissions) => {
  if (!totalMissions || totalMissions.length === 0) return 0;
  return (completedMissions.length / totalMissions.length) * 100;
};
```

### Skill Multipliers

```javascript
const calculateMultipliers = (skills) => {
  return {
    xp: skills.includes('xp_buff') ? 1.25 : 1,
    currency: skills.includes('credit_buff') ? 1.5 : 1,
    criticalChance: skills.includes('critical_hit') ? 0.15 : 0
  };
};
```

### Atmosphere Calculation

```javascript
const calculateAtmosphere = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 10) return 'horizon';
  if (hour >= 10 && hour < 17) return 'solar';
  if (hour >= 17 && hour < 21) return 'sunset';
  return 'midnight';
};
```

---

## State Validation

### Schema Validation

```javascript
const userSchema = {
  username: (value) => typeof value === 'string' && value.length >= 3,
  level: (value) => typeof value === 'number' && value >= 1,
  xp: (value) => typeof value === 'number' && value >= 0,
  currency: (value) => typeof value === 'number' && value >= 0,
  skillPoints: (value) => typeof value === 'number' && value >= 0,
  streak: (value) => typeof value === 'number' && value >= 0,
  isLoggedIn: (value) => typeof value === 'boolean',
  completedMissions: (value) => Array.isArray(value),
  badges: (value) => Array.isArray(value),
  skills: (value) => Array.isArray(value),
  shopPurchases: (value) => Array.isArray(value),
  weakTopics: (value) => Array.isArray(value),
  activeColor: (value) => typeof value === 'string',
  crtMode: (value) => typeof value === 'boolean',
  dataShopUnlocked: (value) => typeof value === 'boolean',
  atmosphere: (value) => ['horizon', 'solar', 'sunset', 'midnight', 'void'].includes(value)
};

export const validateUserData = (userData) => {
  const errors = [];
  
  Object.entries(userSchema).forEach(([key, validator]) => {
    if (!validator(userData[key])) {
      errors.push(`Invalid ${key}: ${userData[key]}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### Runtime Validation

```javascript
// Validate state updates
const safeSetUser = (updater) => {
  setUser(prev => {
    const newState = typeof updater === 'function' ? updater(prev) : updater;
    const validation = validateUserData(newState);
    
    if (!validation.isValid) {
      console.error('Invalid user state:', validation.errors);
      return prev; // Reject invalid update
    }
    
    return newState;
  });
};
```

---

## Performance Optimization

### Memoization Strategies

```javascript
// Expensive calculations memoized
const derivedState = useMemo(() => {
  return {
    xpProgress: calculateXpProgress(user.xp, user.level),
    multipliers: calculateMultipliers(user.skills),
    completionRate: calculateCompletionRate(user.completedMissions, missions),
    nextLevelXp: user.level * 500,
    totalBadges: user.badges.length,
    availableSkills: getAvailableSkills(user.skills, user.skillPoints)
  };
}, [user.xp, user.level, user.skills, user.completedMissions, user.skillPoints]);

// Stable function references
const actions = useMemo(() => ({
  loginUser: (username, avatar) => { /* implementation */ },
  addXP: (amount) => { /* implementation */ },
  // ... other actions
}), []); // Empty dependency array means stable reference
```

### State Normalization

```javascript
// Normalized data structures for better performance
const normalizedData = {
  missions: {
    byId: {
      'm1': { id: 'm1', title: 'React Foundations', ... },
      'm2': { id: 'm2', title: 'Stateful Components', ... }
    },
    allIds: ['m1', 'm2', 'm3']
  },
  questions: {
    byId: {
      'q1': { id: 'q1', text: 'What is JSX?', ... },
      'q2': { id: 'q2', text: 'How do you pass props?', ... }
    },
    byMission: {
      'm1': ['q1', 'q2', 'q11'],
      'm2': ['q3', 'q4', 'q12']
    }
  }
};
```

### Selective Updates

```javascript
// Update only specific parts of state
const updateMissionProgress = (missionId, progress) => {
  setUser(prev => ({
    ...prev,
    missionProgress: {
      ...prev.missionProgress,
      [missionId]: progress
    }
  }));
};

// Batch multiple updates
const batchUpdate = (updates) => {
  setUser(prev => ({
    ...prev,
    ...updates
  }));
};
```

---

## Error Handling & Recovery

### State Error Boundaries

```javascript
class StateErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('State error:', error, errorInfo);
    
    // Attempt to recover from backup
    if (storage.restore()) {
      this.setState({ hasError: false, error: null });
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Attempting to recover your data...</p>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Data Corruption Recovery

```javascript
const recoverUserData = () => {
  // Try to load primary data
  let userData = storage.load();
  
  // If corrupted, try backup
  if (!userData || !validateUserData(userData).isValid) {
    console.warn('Primary data corrupted, attempting recovery...');
    storage.restore();
    userData = storage.load();
  }
  
  // If still corrupted, reset to defaults
  if (!userData || !validateUserData(userData).isValid) {
    console.warn('Recovery failed, resetting to defaults...');
    userData = initializeUser();
  }
  
  return userData;
};
```

---

## Testing State Management

### State Testing Utilities

```javascript
// Test utilities for state management
export const createTestUser = (overrides = {}) => {
  return {
    username: 'testuser',
    avatar: 'avatar1',
    isLoggedIn: true,
    xp: 500,
    level: 2,
    currency: 100,
    skillPoints: 1,
    streak: 5,
    badges: [],
    completedMissions: [],
    weakTopics: [],
    skills: [],
    shopPurchases: [],
    bossHealth: 100000,
    lastActiveDate: new Date().toDateString(),
    activeColor: 'indigo',
    crtMode: false,
    dataShopUnlocked: false,
    atmosphere: 'void',
    ...overrides
  };
};

export const renderWithUserContext = (component, initialUser = null) => {
  const user = initialUser || createTestUser();
  
  return render(
    <UserProvider value={{ user }}>
      {component}
    </UserProvider>
  );
};
```

### State Mutation Tests

```javascript
describe('UserContext State Management', () => {
  it('should add XP correctly', () => {
    const { result } = renderHook(() => useUserContext(), {
      wrapper: UserProvider
    });
    
    act(() => {
      result.current.addXP(100);
    });
    
    expect(result.current.user.xp).toBe(100);
    expect(result.current.user.level).toBe(1);
  });
  
  it('should level up when reaching XP threshold', () => {
    const { result } = renderHook(() => useUserContext(), {
      wrapper: UserProvider
    });
    
    act(() => {
      result.current.addXP(500);
    });
    
    expect(result.current.user.level).toBe(2);
    expect(result.current.user.skillPoints).toBe(1);
  });
  
  it('should apply XP multiplier skill bonus', () => {
    const initialUser = createTestUser({ skills: ['xp_buff'] });
    const { result } = renderHook(() => useUserContext(), {
      wrapper: ({ children }) => (
        <UserProvider initialUser={initialUser}>
          {children}
        </UserProvider>
      )
    });
    
    act(() => {
      result.current.addXP(100);
    });
    
    expect(result.current.user.xp).toBe(125); // 100 * 1.25
  });
});
```

---

## Future Enhancements

### State Management Evolution

**Potential Upgrades**:
- **Redux Toolkit**: For more complex state scenarios
- **Zustand**: Lightweight alternative to Context
- **Jotai**: Atomic state management
- **Valtio**: Proxy-based state management

**Advanced Features**:
- **State Persistence Strategies**: IndexedDB for larger datasets
- **Offline Support**: Service worker synchronization
- **Real-time Updates**: WebSocket integration
- **State Versioning**: Advanced migration system

### Performance Improvements

**Optimization Strategies**:
- **State Splitting**: Multiple contexts for different domains
- **Lazy Loading**: Load state on demand
- **Virtual Scrolling**: For large data lists
- **Web Workers**: Background state processing

---

## Conclusion

The data structures and state management system in LevelUp Lite provide:

**Reliability**: Robust error handling and recovery mechanisms
**Performance**: Optimized updates and memoization
**Scalability**: Modular architecture for future growth
**Maintainability**: Clear patterns and documentation
**User Experience**: Seamless data persistence and recovery

This system ensures that user progress is always saved, the application remains performant, and the codebase stays maintainable as the application grows in complexity.
