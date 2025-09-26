<!-- prompt-manager/CLAUDE.md -->

This file provides guidance to u when working with code in this repository.

# System prompt

U are code-assistant working in one team with the user on the project building chrome-extension for storing prompts and notes. The name of the project – prompts&notes

When coding frontend prioritise clear and and well-strucutred code with seperation of concerns


# Project Overview

This is a **Prompt Manager** application built with React, TypeScript, and Vite. It's designed to help users create, manage, search, and export prompts and notes. The application uses Chrome's local storage for data persistence.

## Key Commands

### Development
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production (runs TypeScript compilation + Vite build)
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### Testing
```bash
npm test             # Run tests with Vitest (configured but no tests yet)
```

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **Custom CSS** with Japanese-inspired retro design theme (refactored from Tailwind CSS 4)
- **Chrome Extension APIs** for local storage persistence
- **ESLint** with TypeScript and React hooks configuration
- **Fuse.js** (for future search functionality)
- **marked** (for potential Markdown support)
- **highlight.js** (for potential syntax highlighting)

## Architecture

### Architecture Pattern
- **Custom Hooks-Based Architecture**: Logic extracted into reusable custom hooks
- **Component-Driven UI**: Components focus on presentation, hooks handle business logic
- **Type-Safe Development**: Centralized TypeScript types with strict mode enabled
- **Error Boundaries**: Graceful error handling at component level
- **Performance Optimized**: React performance best practices with memoization

### Core Architecture Components

#### Data Layer
- **`usePrompts` Hook**: Handles all CRUD operations, Chrome storage integration, and data state management
- **`usePromptFilter` Hook**: Manages search, filtering, sorting logic with memoized performance
- **`useExport` Hook**: Handles export functionality (JSON, CSV) and clipboard operations

#### UI Layer
- **`App.tsx`**: Main orchestration component, connects hooks with UI components
- **Presentational Components**: Focus solely on UI rendering and user interactions
- **Container Components**: None needed - hooks replace container pattern

#### Type System
- **Centralized Types**: All interfaces and types in `/src/types/index.ts`
- **Shared Interfaces**: Consistent typing across all components and hooks
- **Strict TypeScript**: No implicit any, verbatim module syntax enabled

#### Error Handling & UX
- **ErrorBoundary**: Catches React errors and displays graceful fallback UI
- **ErrorMessage**: Reusable error component with retry/dismiss actions
- **LoadingSpinner**: Consistent loading states across the application

### Project Structure
```
├── plan.md
└── prompt-manager
    ├── CLAUDE.md
    ├── dist
    │   ├── assets
    │   │   ├── popup.css
    │   │   └── popup.js
    │   ├── index.html
    │   ├── manifest.json
    │   └── vite.svg
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   ├── manifest.json
    │   └── vite.svg
    ├── src
    │   ├── App.css
    │   ├── App.tsx
    │   ├── assets
    │   │   ├── Screenshot 2025-09-19 at 11.27.59.png
    │   │   └── react.svg
    │   ├── components
    │   │   ├── ErrorBoundary.css
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── ErrorMessage.css
    │   │   ├── ErrorMessage.tsx
    │   │   ├── ExportMenu.css
    │   │   ├── ExportMenu.tsx
    │   │   ├── LoadingSpinner.css
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── PromptCard.css
    │   │   ├── PromptCard.tsx
    │   │   ├── PromptEditor.css
    │   │   ├── PromptEditor.tsx
    │   │   ├── PromptList.css
    │   │   ├── PromptList.tsx
    │   │   ├── SearchBar.css
    │   │   ├── SearchBar.tsx
    │   │   ├── TagFilter.css
    │   │   └── TagFilter.tsx
    │   ├── hooks
    │   │   ├── useExport.ts
    │   │   ├── usePromptFilter.ts
    │   │   └── usePrompts.ts
    │   ├── main.tsx
    │   ├── types
    │   │   └── index.ts
    │   └── vite-env.d.ts
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

### Key Features
- **CRUD Operations**: Create, read, update, delete prompts with async error handling
- **Search & Filter**: Real-time search by title/content with tag filtering
- **Tag System**: Dynamic tag management with validation (max 10 tags)
- **Export**: JSON and CSV export with timestamped filenames
- **Copy to Clipboard**: Async clipboard operations with error handling
- **Error Recovery**: Graceful error handling with retry mechanisms
- **Loading States**: Consistent loading indicators during async operations

### Data Flow Architecture

#### State Management Flow
1. **User Action** → Component event handler
2. **Component** → Calls custom hook method
3. **Hook** → Performs async operation (Chrome storage)
4. **Hook** → Updates internal state
5. **Hook** → Returns updated data to component
6. **Component** → Re-renders with new data

#### Hook Dependencies
- `usePrompts`: Independent, manages prompt data
- `usePromptFilter`: Depends on prompts data, provides filtered results
- `useExport`: Independent, provides export utilities

### Performance Optimizations

#### React Performance
- **useMemo**: Expensive filtering operations memoized in usePromptFilter
- **useCallback**: Stable function references prevent unnecessary re-renders
- **Memoized Components**: Components only re-render when props change
- **Optimized Filtering**: Search and tag filtering cached until dependencies change

#### Bundle Optimization
- **Tree Shaking**: Unused code eliminated during build
- **Code Splitting**: Automatic chunking for large applications
- **CSS Optimization**: Component-scoped styles for better caching

## Development Notes

### Chrome Extension Context
- Application checks for `chrome?.storage?.local` availability
- Gracefully handles cases where Chrome APIs are not available
- Could be adapted for web use with localStorage fallback
- Async operations include proper error handling and loading states

### Styling Approach
- **Custom CSS Architecture**: Component-based CSS organization (refactored September 2024)
- **Japanese-Inspired Theme**: Custom color palette with washi paper textures and retro aesthetics
- **Component-Scoped Styles**: Each component has its own CSS file for better maintainability
- **Global Styles**: App.css contains only global variables, base styles, and utilities
- **Responsive Design**: Mobile-first approach with Japanese design elements
- **CSS Variables**: Centralized color management with themes like --sumi-ink, --washi-white, --vermilion

### Build Configuration
- Vite configured for single-page application build
- Rollup options optimized for Chrome extension popup structure
- TypeScript compilation includes strict type checking with verbatim module syntax

## Testing

The project is configured with Vitest and @testing-library/react but currently has no tests. When adding tests:

- Tests should be placed in `src/__tests__/` directory
- Use `*.test.tsx` or `*.test.ts` naming convention
- Follow React Testing Library patterns for component testing
- Test hooks separately with @testing-library/react-hooks

## Linting and Code Quality

- ESLint configuration includes TypeScript, React hooks, and React refresh rules
- Uses TypeScript strict mode for type safety
- Verbatim module syntax enabled for cleaner imports
- No explicit any types allowed without justification

## Future Enhancements

The application has dependencies for advanced features not yet implemented:
- **Fuse.js**: Advanced fuzzy search capabilities
- **marked**: Markdown rendering support
- **highlight.js**: Syntax highlighting for code blocks

### Hook Extensions
- **useDebounce**: Debounced search for better performance
- **useLocalStorage**: Fallback for non-Chrome environments
- **useToast**: Toast notification system
- **useConfirmation**: Confirmation dialogs for destructive actions