# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

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
- **Tailwind CSS 4** for styling with custom color themes
- **Chrome Extension APIs** for local storage persistence
- **ESLint** with TypeScript and React hooks configuration
- **Fuse.js** (for future search functionality)
- **marked** (for potential Markdown support)
- **highlight.js** (for potential syntax highlighting)

## Architecture

### Core Components
- **App.tsx**: Main component containing all application logic
- **State Management**: Uses React's useState for local state
- **Data Persistence**: Chrome storage.local API for saving prompts
- **Views**: Single-page application with conditional rendering for list/edit modes

### Data Structure
```typescript
interface Prompt {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  category?: string
}
```

### Key Features
- **CRUD Operations**: Create, read, update, delete prompts
- **Search**: Filter prompts by title/content
- **Tag System**: Dynamic tag filtering and management
- **Export**: JSON and CSV export functionality
- **Copy to Clipboard**: Quick content copying

## Development Notes

### Chrome Extension Context
- Application checks for `chrome?.storage?.local` availability
- Gracefully handles cases where Chrome APIs are not available
- Could be adapted for web use with localStorage fallback

### Styling Approach
- Tailwind CSS with custom color variants for light/dark themes
- Responsive design using Tailwind's utility classes
- Component-based structure with consistent spacing and colors

### Build Configuration
- Vite configured for single-page application build
- Rollup options optimized for Chrome extension popup structure
- TypeScript compilation includes strict type checking

## Testing

The project is configured with Vitest and @testing-library/react but currently has no tests. When adding tests:

- Tests should be placed in `src/__tests__/` directory
- Use `*.test.tsx` or `*.test.ts` naming convention
- Follow React Testing Library patterns for component testing

## Linting and Code Quality

- ESLint configuration includes TypeScript, React hooks, and React refresh rules
- Uses TypeScript strict mode for type safety
- Consider enabling type-aware linting for production builds (see README.md)

## Future Enhancements

The application has dependencies for advanced features not yet implemented:
- **Fuse.js**: Advanced fuzzy search capabilities
- **marked**: Markdown rendering support
- **highlight.js**: Syntax highlighting for code blocks