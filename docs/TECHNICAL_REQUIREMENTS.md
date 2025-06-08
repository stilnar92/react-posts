# Technical Requirements & Architectural Principles

## 🏗️ Architectural Foundation

### Feature-Sliced Design (FSD) Methodology

**Core Philosophy**: Organize code by business value and feature boundaries rather than technical concerns.

**Layer Structure** (bottom to top):
- **`shared/`** - Reusable code across the entire application
- **`entities/`** - Business entities and domain models
- **`features/`** - Business features and user interactions
- **`widgets/`** - Composite UI blocks combining multiple features
- **`pages/`** - Application pages and routing
- **`app/`** - Application initialization and global setup

**Key Principles**:
- **Unidirectional Dependencies**: Higher layers can only import from lower layers
- **Feature Isolation**: Features cannot directly import from each other
- **Shared Responsibility**: Common code resides in the shared layer
- **Business-Oriented**: Structure reflects business requirements

## 🎯 Technology Stack

### Core Technologies
- **React 18** - UI library with functional components and hooks
- **TypeScript** - Strict mode for type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Build tool and development server

### Recommended Libraries

#### Styling & Component Variants
- **Class Variance Authority (CVA)** - Type-safe component variant creation
- **clsx** - Utility for conditional CSS class combining
- **tailwind-merge** - Smart merging of Tailwind classes without conflicts

#### Data Fetching & State Management
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management (when needed)
- **Immer** - Immutable state updates

#### Development & Quality
- **ESLint** - Code linting with React and TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking for tests

#### Build & Deployment
- **Vite** - Build tool with TypeScript support
- **Vitest** - Unit testing (Vite-native)
- **Playwright** - E2E testing (when needed)

## 🎭 Component Development Philosophy

### Headless UI Pattern

**Philosophy**: Separate behavior/logic from visual presentation for maximum flexibility.

**Key Principles**:
- **Logic in Custom Hooks**: Extract all behavior into reusable hooks
- **Unstyled Components**: Components focus only on structure and accessibility
- **Complete Style Control**: Developers have full control over appearance
- **Built-in Accessibility**: ARIA attributes and keyboard navigation included

**Implementation Approach**:
- Create custom hooks for component logic (useModal, useSelect, etc.)
- Build unstyled components that consume these hooks
- Provide styling through className props and Tailwind CSS
- Ensure keyboard navigation and screen reader support

### Compound Components Pattern

**Philosophy**: Create composable APIs that work together as a cohesive system.

**Benefits**:
- **Semantic API**: Clear, readable component composition
- **Flexible Structure**: Components can be rearranged and customized
- **Context Sharing**: Internal state shared between related components
- **Type Safety**: Full TypeScript support for component relationships

### Accessibility-First Approach

**Philosophy**: Build accessibility into components from the ground up.

**Requirements**:
- **WCAG 2.1 AA Compliance**: Meet accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical focus order and visible focus indicators
- **Color Contrast**: Sufficient contrast ratios for all text

## 🔄 Data Fetching Principles

### React Query Philosophy

**Philosophy**: Treat server state as a separate concern from client state with automatic synchronization.

**Core Concepts**:
- **Query Keys**: Hierarchical keys for cache organization
- **Stale-While-Revalidate**: Show cached data while fetching fresh data
- **Background Updates**: Automatic refetching on window focus/reconnect
- **Optimistic Updates**: Immediate UI feedback with rollback capability
- **Smart Caching**: Automatic cache management with TTL

**Recommended Patterns**:
- **Query Key Factories**: Centralized query key management
- **Custom Query Hooks**: Feature-specific data fetching hooks
- **Mutation Hooks**: Standardized data mutation patterns
- **Cache Invalidation**: Strategic cache invalidation strategies
- **Error Boundaries**: Graceful error handling and fallbacks

### Server State vs Client State

**Server State Characteristics**:
- Asynchronous by nature
- Shared across users/sessions
- Can become outdated
- Requires synchronization

**Client State Characteristics**:
- Synchronous and immediate
- Local to application instance
- Always up-to-date
- No synchronization needed

## 🎨 Styling Architecture

### Tailwind CSS + CVA Approach

**Philosophy**: Utility-first CSS with type-safe component variants for systematic design.

### Class Variance Authority (CVA) Integration

**CVA Philosophy**: Create type-safe, composable component variants with automatic type inference.

**Key CVA Principles**:
- **Component Variants**: Define all possible styling variants
- **Compound Variants**: Combinations of variants for complex states
- **Type Safety**: Automatic TypeScript type generation
- **Default Variants**: Define base values for each variant
- **Conditional Logic**: Smart logic for style application

**CVA Component Structure**:
```typescript
// Base styles + variants + compound variants + default values
const componentVariants = cva("base-classes", {
  variants: {
    size: { ... },
    variant: { ... },
    state: { ... }
  },
  compoundVariants: [...],
  defaultVariants: { ... }
});
```

**Style Organization Patterns**:
- **Base Styles**: Common styles for all component variants
- **Simple Variants**: Separate styling dimensions (size, color, state)
- **Compound Variants**: Special combinations of variants
- **Conditional Styles**: Styles dependent on external conditions

### Design System with CVA

**Design Tokens Integration**:
- **Color Palette**: Systematic color variants
- **Typography Scale**: Text sizes and line heights
- **Spacing System**: Consistent margins and paddings
- **Shadow System**: Depth and elevation gradations
- **Radius System**: Various levels of corner rounding

**Recommended Variant Structure**:
- **Size Variants**: xs, sm, md, lg, xl (component sizes)
- **Color Variants**: primary, secondary, success, warning, error, ghost
- **State Variants**: default, hover, active, disabled, loading
- **Visual Variants**: solid, outline, ghost, link (visual styles)

### Tailwind CSS Configuration

**CVA Customization**:
- **Extended Color Palette**: Semantic colors for all states
- **Typography System**: Hierarchy of font sizes and weights
- **Spacing System**: Consistent values for all spacing
- **Breakpoint System**: Mobile-first responsive design
- **Animation System**: Consistent transitions and animations

**Recommended Tailwind Plugins**:
- **@tailwindcss/forms** - Form styling
- **@tailwindcss/typography** - Typography styles
- **@tailwindcss/container-queries** - Container queries support
- **tailwindcss-animate** - Ready-made animations

### Style Management Utilities

**Class Management**:
- **clsx**: Conditional CSS class combining
- **tailwind-merge**: Smart resolution of Tailwind class conflicts
- **cn helper**: Combination of clsx and tailwind-merge for optimal DX

**Usage Patterns**:
- **Base Components**: CVA variants + className override capability
- **Composite Components**: Variant inheritance between related components
- **Responsive Variants**: Adaptive variants for different breakpoints
- **Dark Mode Variants**: Automatic dark theme support

**Organizational Principles**:
- **Variant-Oriented Architecture**: Each component has clearly defined variants
- **Variant Composition**: Reusing variants between components
- **Style Type Safety**: Full TypeScript support for all variants
- **Performance Optimization**: Minimal CSS output through tree shaking


## 📁 File Organization

### FSD Directory Structure
```
src/
├── app/                    # Application initialization
├── pages/                  # Pages and routing
├── widgets/                # Composite UI blocks
├── features/               # Business features
├── entities/               # Business entities
└── shared/                 # Shared resources
    ├── ui/                 # Reusable UI components
    ├── api/                # API layer and data fetching
    ├── lib/                # Utilities and helpers
    ├── types/              # Shared TypeScript types
    └── config/             # Configuration files
```

### Naming Conventions

**Files and Directories**:
- **Layers**: lowercase (app, pages, widgets, features, entities, shared)
- **Slices**: kebab-case (posts-list, user-profile)
- **Segments**: lowercase (ui, model, lib, api)
- **Components**: PascalCase (PostCard.tsx, UserProfile.tsx)
- **Hooks**: camelCase with "use" prefix (usePostData.ts)
- **Utilities**: camelCase (formatDate.ts, validateEmail.ts)
- **Types**: PascalCase (User.ts, PostData.ts)

## 🔧 Development Workflow

### Code Quality Standards

**TypeScript Configuration**:
- Strict mode enabled
- No implicit any
- Exact optional property types
- Path mapping for clean imports (@/ alias)

**ESLint Rules**:
- React hooks rules
- Accessibility rules
- TypeScript-specific rules
- Import/export rules

**Git Workflow**:
- Feature branch workflow
- Conventional commit messages
- Pre-commit hooks for linting and formatting
- Mandatory code review in pull requests

## 🚀 Performance Considerations

### Optimization Strategies

**Component Optimization**:
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references
- Code splitting with React.lazy

**Bundle Optimization**:
- Tree shaking enabled
- Dynamic imports for route-based splitting
- Vite's built-in optimizations
- Asset optimization and compression

**Runtime Performance**:
- Virtual scrolling for large lists
- Image lazy loading
- Debounced search inputs
- Optimistic UI updates

## 📚 Documentation Requirements

### Code Documentation

**Inline Documentation**:
- JSDoc comments for complex functions
- Type annotations for all props and APIs
- README files for each major feature
- Architecture Decision Records (ADRs)

**API Documentation**:
- Complete prop interfaces
- Usage examples
- Migration guides
- Best practices documentation

This technical architecture provides:
- **Scalable Structure**: Easy to add new features and maintain existing code
- **Developer Experience**: Clear patterns and consistent conventions
- **Performance**: Optimized for both development and production
- **Accessibility**: Built-in support for all users
- **Type Safety**: Complete TypeScript coverage
- **Testing**: Comprehensive testing strategy
- **Maintainability**: Clear separation of concerns and documentation 