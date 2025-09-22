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
- **Container/Presenter**: App.tsx serves as the container (logic/state), components are presenters (UI/interaction)
- **Single Responsibility**: Each component handles one specific UI concern
- **Props-Driven**: Components receive data and callbacks via props for clear data flow
- **State Management**: Centralized in App.tsx using React's useState hooks
- **Data Persistence**: Chrome storage.local API integration managed at the App level

### Project Structure
```
.
├── CLAUDE.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── plan.md
├── postcss.config.js
├── prd.md
├── public
│   ├── manifest.json
│   └── vite.svg
├── src
│   ├── App.css                    # Global styles and CSS variables
│   ├── App.tsx                    # Main application container
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── ExportMenu.tsx         # Export functionality component
│   │   ├── ExportMenu.css         # Export menu-specific styles
│   │   ├── PromptCard.tsx         # Individual prompt card component
│   │   ├── PromptCard.css         # Card-specific styles
│   │   ├── PromptEditor.tsx       # Prompt creation/editing component
│   │   ├── PromptEditor.css       # Editor-specific styles
│   │   ├── PromptList.tsx         # List view component
│   │   ├── PromptList.css         # List-specific styles
│   │   ├── SearchBar.tsx          # Search functionality component
│   │   ├── SearchBar.css          # Search-specific styles
│   │   ├── TagFilter.tsx          # Tag filtering component
│   │   └── TagFilter.css          # Tag filter-specific styles
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
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
- **Custom CSS Architecture**: Component-based CSS organization (refactored September 2024)
- **Japanese-Inspired Theme**: Custom color palette with washi paper textures and retro aesthetics
- **Component-Scoped Styles**: Each component has its own CSS file for better maintainability
- **Global Styles**: App.css contains only global variables, base styles, and utilities
- **Responsive Design**: Mobile-first approach with Japanese design elements
- **CSS Variables**: Centralized color management with themes like --sumi-ink, --washi-white, --vermilion

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