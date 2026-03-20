# SkillKode Component Architecture Documentation

## Overview

SkillKode follows a modular component architecture with clear separation of concerns. The application is built using React's functional component pattern with hooks for state management and side effects.

## Architecture Principles

- **Single Responsibility**: Each component has a single, well-defined purpose
- **Composition over Inheritance**: Components are composed together rather than using inheritance
- **Prop Drilling Minimization**: Context API used for global state
- **Reusable UI Components**: Common UI elements are abstracted into reusable components
- **Performance Optimization**: Components use React.memo and proper dependency arrays

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── BorderGlow.jsx  # Glowing border effect
│   ├── ElectricBorder.jsx # Animated electric border
│   ├── PrismaticBurst.jsx # Advanced visual effects
│   ├── HackerConsole.jsx # Quantum console
│   ├── HackerTerminal.jsx # Basic terminal
│   ├── LootBox.jsx     # Animated loot box
│   ├── ProgressBar.jsx # Progress indicator
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── SoftAurora.jsx  # Aurora background effect
│   └── TrophyToast.jsx # Achievement notifications
├── pages/              # Page-level components
│   ├── Arena.jsx       # 1v1 code duels
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Leaderboard.jsx # Rankings
│   ├── Login.jsx       # Authentication
│   ├── Missions.jsx    # Mission selection
│   ├── Profile.jsx     # User profile
│   ├── Quiz.jsx        # Quiz interface
│   ├── SkillTree.jsx   # Neural skill tree
│   ├── Store.jsx       # In-game shop
│   └── TrophyGallery.jsx # Achievement display
├── context/            # React contexts
│   └── UserContext.jsx # Global user state
├── data/               # Static data
│   ├── leaderboard.json
│   ├── missions.json
│   └── questions.json
├── utils/              # Utility functions
│   ├── audioEngine.js  # Sound effects
│   └── storage.js      # LocalStorage management
├── assets/             # Static assets
├── App.jsx             # Root component
├── main.jsx            # Entry point
├── App.css             # Global styles
└── index.css           # Base styles
```

## Component Hierarchy

```
App
├── UserProvider (Context)
├── BrowserRouter (Routing)
└── AppRoutes
    ├── TrophyToast
    ├── HackerTerminal (Conditional)
    ├── HackerConsole (Conditional)
    ├── PrismaticBurst (Background)
    ├── Confetti (Conditional)
    ├── Sidebar
    └── Main Content Area
        └── Routes
            ├── Dashboard
            ├── Missions
            ├── Quiz
            ├── Leaderboard
            ├── Profile
            ├── Store
            ├── Arena
            ├── SkillTree
            └── TrophyGallery
```

## Core Components

### App.jsx

**Purpose**: Root application component with routing and global effects

**Key Features**:
- Route management with React Router
- Global keyboard shortcuts (Ctrl+Shift+H, Alt+T)
- Level-up animations with confetti
- Dynamic atmosphere theming
- Prismatic burst background effects

**State Management**:
- Uses UserContext for global state
- Local state for terminal/console visibility
- Effect hooks for keyboard listeners

**Dependencies**:
- React Router for navigation
- Framer Motion for animations
- UserContext for state management

### UserContext.jsx

**Purpose**: Global state management for user data and application state

**State Structure**:
- User profile data (username, avatar, stats)
- Progress tracking (XP, level, missions)
- Achievements and badges
- Shop purchases and inventory
- UI preferences (CRT mode, themes)

**Key Functions**:
- `loginUser()`: User authentication
- `addXP()`: Experience point management
- `addCurrency()`: Credit management
- `completeMission()`: Mission progress
- `unlockBadge()`: Achievement system
- `purchaseItem()`: Shop transactions
- `unlockSkill()`: Skill tree progression

**Performance Optimizations**:
- Debounced localStorage saves
- Efficient state updates
- Memoized calculations for multipliers

### Sidebar.jsx

**Purpose**: Navigation and user stats display

**Features**:
- Navigation menu items
- User stats display (level, XP, credits)
- CRT mode toggle
- Logout functionality
- Responsive design

**Styling**:
- Glassmorphism effects
- Dynamic theming based on atmosphere
- Hover animations
- Active state indicators

## Page Components

### Dashboard.jsx

**Purpose**: Main dashboard with user overview and quick actions

**Features**:
- User stats overview
- Recent activity
- Quick access to features
- Boss raid integration
- Daily rewards

**Components Used**:
- ProgressBar for XP/level display
- BossRaid for community boss
- TrophyToast for achievements

### Missions.jsx

**Purpose**: Mission selection and progress tracking

**Features**:
- Mission grid layout
- Difficulty indicators
- Progress tracking
- Topic filtering
- XP rewards display

**Data Integration**:
- Loads missions from `missions.json`
- Tracks completed missions
- Calculates completion percentage

### Quiz.jsx

**Purpose**: Interactive quiz interface for missions

**Features**:
- Question display with timer
- Multiple choice interface
- Score tracking
- Combo system
- Theoretical analysis feedback

**State Management**:
- Question progress
- Timer countdown
- Score calculation
- Combo tracking
- Answer validation

### Arena.jsx

**Purpose**: 1v1 code duels against AI opponents

**Features**:
- AI opponent selection
- Code prediction challenges
- Real-time scoring
- Combo streaks
- Battle animations

**AI System**:
- Multiple AI personalities (Dr0id, CyberShark)
- Dynamic difficulty scaling
- Code challenge generation
- Response time simulation

### Store.jsx

**Purpose**: In-game shop for cosmetic items

**Features**:
- Item categories (colors, effects, etc.)
- Purchase system
- Inventory management
- Preview system
- Credit tracking

**Economy**:
- Credit-based transactions
- Item ownership tracking
- Preview before purchase
- Refund system (if implemented)

### SkillTree.jsx

**Purpose**: Neural skill tree for character progression

**Features**:
- Visual skill tree layout
- Skill point system
- Prerequisite checking
- Skill descriptions
- Unlock animations

**Skill System**:
- Passive abilities
- Multipliers and buffs
- Permanent upgrades
- Skill point economy

## Utility Components

### PrismaticBurst.jsx

**Purpose**: Advanced visual effects using OGL (WebGL)

**Features**:
- 3D rotating effects
- Dynamic color palettes
- Mouse interaction
- Performance optimization
- Multiple animation types

**Technical Details**:
- Uses OGL library for WebGL rendering
- Custom shader effects
- Responsive to user interactions
- Optimized for performance

### HackerConsole.jsx

**Purpose**: Quantum console easter egg

**Features**:
- Command-line interface
- Multiple commands
- Hacking-themed interactions
- ASCII art
- Sound effects

**Commands**:
- `scan`: System analysis
- `breach [host]`: Attack simulation
- `market`: Hidden shop access
- `system`: Hardware diagnostics

### TrophyToast.jsx

**Purpose**: Achievement notification system

**Features**:
- Animated notifications
- Badge display
- Auto-dismiss timer
- Stack management
- Sound effects

### ProgressBar.jsx

**Purpose**: Reusable progress indicator

**Features**:
- Customizable colors
- Smooth animations
- Percentage display
- Responsive sizing
- Multiple styles

## Data Components

### Data Integration

**Static Data Sources**:
- `missions.json`: Mission definitions
- `questions.json`: Quiz questions
- `leaderboard.json`: Mock leaderboard data

**Data Flow**:
1. Components import static data
2. User interactions modify state
3. State changes persist to localStorage
4. Components re-render with new data

### Storage Management

**LocalStorage Utils**:
- `loadUserData()`: Retrieve saved data
- `saveUserData()`: Persist user progress
- `initializeUser()`: Create default user

**Data Validation**:
- Schema validation on load
- Fallback values for missing data
- Version compatibility checks

## Performance Optimizations

### Component Optimization

**React.memo Usage**:
- Prevents unnecessary re-renders
- Used in pure UI components
- Custom comparison functions where needed

**useEffect Optimization**:
- Proper dependency arrays
- Cleanup functions
- Debounced operations

**State Management**:
- Minimized state updates
- Batched operations
- Efficient data structures

### Rendering Optimization

**Lazy Loading**:
- Code splitting for large components
- Dynamic imports for pages
- Progressive loading

**CSS Optimization**:
- Tailwind CSS for utility-first styling
- Minimal custom CSS
- Optimized animations

## Styling Architecture

### CSS Organization

**Global Styles**:
- `index.css`: Base styles and resets
- `App.css`: Application-specific styles
- Component-specific CSS files

**Styling Approach**:
- Tailwind CSS for utility classes
- Custom CSS for complex animations
- CSS-in-JS for dynamic styles
- CSS variables for theming

### Theme System

**Atmosphere Theming**:
- Dynamic color palettes
- Time-based theme switching
- CSS custom properties
- Smooth transitions

**CRT Mode**:
- Retro display effects
- Scan lines and curvature
- Color bleeding simulation
- Toggle-able feature

## Animation System

### Animation Libraries

**Framer Motion**:
- Page transitions
- Component animations
- Gesture handling
- Spring physics

**CSS Animations**:
- Hover effects
- Loading animations
- Background effects
- Micro-interactions

### Performance Considerations

**GPU Acceleration**:
- Transform-based animations
- Will-change property usage
- Compositing optimization

**Animation Cleanup**:
- Proper cleanup in useEffect
- Animation state management
- Memory leak prevention

## Error Handling

### Error Boundaries

**Implementation**:
- Catch component errors
- Display fallback UI
- Log errors for debugging
- Prevent app crashes

**Validation**:
- Input validation
- Type checking
- Fallback values
- Graceful degradation

## Testing Strategy

### Component Testing

**Unit Tests**:
- Component rendering
- Props validation
- State changes
- Event handling

**Integration Tests**:
- Component interactions
- Data flow
- User workflows
- API integration

### Testing Tools

**Recommended Libraries**:
- React Testing Library
- Jest for unit tests
- Cypress for E2E tests
- Storybook for component documentation

## Future Enhancements

### Scalability

**Component Library**:
- Storybook integration
- Design system
- Component documentation
- Reusable patterns

**Performance**:
- Virtual scrolling
- Code splitting
- Service workers
- Caching strategies

### Features

**Real-time Features**:
- WebSocket integration
- Live leaderboards
- Multiplayer arena
- Real-time boss raids

**Advanced Features**:
- Machine learning for difficulty
- Personalized content
- Advanced analytics
- Social features
