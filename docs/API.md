# SkillKode API Documentation

## Overview

SkillKode is a cyberpunk-themed gamification platform built with React. This document outlines the complete API structure, components, and data flow.

## Table of Contents

- [User Context API](#user-context-api)
- [Component API](#component-api)
- [Data Structures](#data-structures)
- [Utilities](#utilities)
- [Routes & Navigation](#routes--navigation)

---

## User Context API

The `UserContext` provides the central state management for the entire application.

### Provider

```jsx
<UserProvider>
  <App />
</UserProvider>
```

### Context Value

The context provides access to the following values and functions:

#### State Values

- **`user`**: Object containing all user data
- **`leveledUp`**: Boolean flag for level-up animation
- **`newBadge`**: Object containing newly unlocked badge info

#### Functions

- **`loginUser(username, avatar)`**: Authenticate user
- **`logoutUser()`**: Log out current user
- **`addXP(amount)`**: Add experience points with skill multipliers
- **`addCurrency(amount)`**: Add credits with skill multipliers
- **`completeMission(missionId, topic)`**: Mark mission as completed
- **`addWeakTopic(topic)`**: Add topic to weak areas list
- **`unlockBadge(badgeId)`**: Unlock achievement badge
- **`purchaseItem(itemId, cost, type)`**: Purchase shop items
- **`equipColor(color)`**: Change active color theme
- **`toggleCRTMode()`**: Toggle CRT display mode
- **`unlockSkill(skillId, cost)`**: Purchase skill tree nodes
- **`damageBoss(damage)`**: Deal damage to raid boss

### User Object Structure

```javascript
{
  username: string,
  avatar: string,
  isLoggedIn: boolean,
  xp: number,
  level: number,
  currency: number,
  streak: number,
  completedMissions: array,
  weakTopics: array,
  badges: array,
  shopPurchases: array,
  activeColor: string,
  crtMode: boolean,
  lastActiveDate: string,
  lastLootDate: string,
  skillPoints: number,
  skills: array,
  bossHealth: number,
  dataShopUnlocked: boolean,
  atmosphere: string
}
```

### Badge Definitions

```javascript
export const BADGE_DEFS = {
  first_blood: { 
    id: 'first_blood', 
    name: 'First Blood', 
    desc: 'Complete your first interaction in the Arena.', 
    icon: '🩸' 
  },
  combo_king: { 
    id: 'combo_king', 
    name: 'Combo King', 
    desc: 'Achieve a 3x Combo streak in a single quiz run.', 
    icon: '🔥' 
  },
  speed_demon: { 
    id: 'speed_demon', 
    name: 'Speed Demon', 
    desc: 'Answer correctly with more than 12s remaining.', 
    icon: '⚡' 
  },
  boss_slayer: { 
    id: 'boss_slayer', 
    name: 'Boss Slayer', 
    desc: 'Defeat the Frontend Gauntlet boss mission.', 
    icon: '🐉' 
  },
  rich_hacker: { 
    id: 'rich_hacker', 
    name: 'Rich Hacker', 
    desc: 'Accumulate over 500 Credits.', 
    icon: '💰' 
  }
};
```

---

## Component API

### Core Components

#### App.jsx
Main application component with routing and global effects.

**Props**: None

**Features**:
- Route management with React Router
- Global keyboard shortcuts (Ctrl+Shift+H, Alt+T)
- Level-up animations with confetti
- Dynamic atmosphere theming
- Prismatic burst background effects

#### Sidebar.jsx
Navigation sidebar component.

**Props**: None

**Features**:
- Navigation menu items
- User stats display
- CRT mode toggle
- Logout functionality

#### PrismaticBurst.jsx
Advanced visual effects component using OGL (OpenGL).

**Props**:
```javascript
{
  animationType: string,     // 'rotate3d', 'pulse', etc.
  intensity: number,         // Effect intensity (1-5)
  speed: number,            // Animation speed
  distort: number,          // Distortion amount
  paused: boolean,          // Pause animation
  offset: {x: number, y: number},
  hoverDampness: number,    // Mouse interaction dampening
  rayCount: number,         // Number of rays
  mixBlendMode: string,     // CSS blend mode
  colors: array            // Color palette
}
```

#### HackerTerminal.jsx
Easter egg terminal component.

**Props**:
```javascript
{
  onClose: function         // Close callback
}
```

#### HackerConsole.jsx
Advanced quantum console with commands.

**Props**:
```javascript
{
  onClose: function         // Close callback
}
```

**Available Commands**:
- `scan`: Locate vulnerabilities
- `breach [host]`: Brute force simulation
- `market`: Access dark web shop
- `system`: Hardware diagnostics

### UI Components

#### ProgressBar.jsx
Simple progress bar component.

**Props**:
```javascript
{
  progress: number,         // 0-100 percentage
  color: string,           // Tailwind color class
  height: string           // Height class
}
```

#### TrophyToast.jsx
Achievement notification component.

**Props**: None (uses context)

#### BossRaid.jsx
Community raid boss component.

**Props**: None (uses context)

#### LootBox.jsx
Animated loot box component.

**Props**:
```javascript
{
  reward: object,          // Reward data
  onOpen: function         // Open callback
}
```

---

## Data Structures

### Mission Data Structure

```javascript
{
  id: string,              // Unique identifier
  title: string,           // Display title
  description: string,      // Mission description
  xpReward: number,        // XP reward amount
  topic: string,          // Mission topic/category
  difficulty: string       // Easy/Medium/Hard/Boss
}
```

### Question Data Structure

```javascript
{
  id: string,              // Unique identifier
  text: string,            // Question text
  options: array,          // Answer options
  correct: string          // Correct answer
}
```

### Leaderboard Data Structure

```javascript
{
  username: string,
  avatar: string,
  level: number,
  xp: number,
  badges: array
}
```

---

## Utilities

### Storage Utils (`src/utils/storage.js`)

#### Functions

- **`loadUserData()`**: Load user data from localStorage
- **`saveUserData(userData)`**: Save user data to localStorage
- **`initializeUser()`**: Create default user object

### Audio Engine (`src/utils/audioEngine.js`)

#### Functions

- **`sfx.click()`**: Play click sound
- **`sfx.levelUp()`**: Play level up sound
- **`sfx.unlock()`**: Play unlock sound
- **`sfx.wrong()`**: Play error sound
- **`sfx.success()`**: Play success sound

---

## Routes & Navigation

### Available Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Navigate to `/dashboard` | Root redirect |
| `/dashboard` | Dashboard | Main dashboard with stats |
| `/missions` | Missions | Available missions list |
| `/quiz/:id` | Quiz | Individual quiz page |
| `/leaderboard` | Leaderboard | Global rankings |
| `/profile` | Profile | User profile page |
| `/store` | Store | In-game shop |
| `/arena` | Arena | 1v1 code duels |
| `/skills` | SkillTree | Neural skill tree |
| `/gallery` | TrophyGallery | Achievement gallery |

### Navigation Structure

The application uses React Router v6 with the following pattern:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} />
    // ... other routes
  </Routes>
</BrowserRouter>
```

---

## Skill System

### Available Skills

| Skill ID | Name | Cost | Effect |
|----------|------|------|--------|
| `xp_buff` | The Architect | 1 SP | +25% XP multiplier |
| `credit_buff` | Merchant Lord | 1 SP | +50% Credit boost |
| `critical_hit` | Precision Strike | 2 SP | Critical hit logic for raids |
| `dark_web` | Dark Web Access | 3 SP | Unlock terminal marketplace |

### Skill Tree Logic

- Skills are purchased with Skill Points (SP)
- SP earned on level up (1 SP per level)
- Skills provide permanent passive effects
- Some skills have prerequisites

---

## Atmosphere System

The application features dynamic theming based on real-world time:

### Atmosphere Types

- **Horizon** (5:00-10:00): Morning theme with amber/orange colors
- **Solar** (10:00-17:00): Day theme with bright blue/yellow
- **Sunset** (17:00-21:00): Evening theme with pink/purple
- **Midnight** (21:00-5:00): Night theme with deep blue/purple

### Implementation

Atmosphere is determined by `updateAtmosphere()` function which:
1. Gets current hour from `new Date().getHours()`
2. Maps hour to atmosphere type
3. Updates user state
4. Applies CSS classes for theming

---

## CRT Mode

Toggle-able retro CRT display effect that adds:
- Screen curvature simulation
- Scan lines
- Screen flicker
- Color bleeding
- Glow effects

Activated via:
- Sidebar toggle button
- Keyboard shortcut support

---

## Easter Eggs & Hidden Features

### Quantum Console (Alt+T)
Advanced terminal with hacking-themed commands:
- `scan`: System vulnerability simulation
- `breach [host]`: Brute force attack simulation
- `market`: Access to hidden shop (requires skill)
- `system`: Hardware diagnostics display

### Hacker Terminal (Ctrl+Shift+H)
Simpler terminal with basic commands and ASCII art.

### Confetti Animations
Triggered on:
- Level up events
- Major achievements
- Boss defeats

---

## Performance Considerations

### Optimization Features

- Component lazy loading for large pages
- Debounced user input
- Optimized re-renders with React.memo
- Efficient state updates
- LocalStorage caching

### Memory Management

- Cleanup functions in useEffect hooks
- Event listener removal
- Proper component unmounting
- State reset on logout

---

## Error Handling

### Global Error Boundaries
- Catch and display user-friendly errors
- Prevent app crashes
- Log errors for debugging

### Data Validation
- Input sanitization
- Type checking for user data
- Fallback values for missing data
- Graceful degradation

---

## Security Considerations

### Client-Side Security
- Input validation and sanitization
- XSS prevention through React's built-in protection
- Secure localStorage usage with JSON serialization
- No sensitive data in client-side storage

### Data Integrity
- User data validation on load
- Backup mechanisms for corrupted data
- Version compatibility checks
- Migration scripts for data structure changes
