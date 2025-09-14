// prompts&notes // prd.md

# Prompt Manager Chrome Extension - Technical PRD

## 1. Executive Summary

A Chrome extension for individual users to store, organize, and manage LLM prompts with local storage, full-text search, tag-based organization, and multiple export formats.

## 2. Product Overview

### 2.1 Vision
Create a lightweight, efficient prompt management tool that integrates seamlessly into Chrome for individual content creators, developers, and AI enthusiasts.

### 2.2 Core Value Proposition
- **Local Storage**: Complete privacy, no internet required
- **Fast Search**: Instant full-text search across all prompts
- **Flexible Organization**: Tag-based system for easy categorization
- **Multiple Export**: JSON, CSV, and Markdown export options

## 3. MVP Features

### 3.1 Core Features
- **Prompt Storage**: Create, edit, delete prompts
- **Full-text Search**: Search across titles and content
- **Tag System**: Add/remove tags for organization
- **Markdown Preview**: Real-time preview of formatted content
- **Copy to Clipboard**: One-click copy functionality
- **Export Options**: JSON, CSV, and Markdown export

### 3.2 UI/UX Requirements
- **Popup Interface**: Accessible via Chrome toolbar icon
- **Responsive Design**: Optimized for various popup sizes
- **Dark/Light Mode**: Theme switching capability
- **Keyboard Shortcuts**: Quick access to common actions

### 3.3 Performance Requirements
- **Fast Loading**: < 500ms popup open time
- **Instant Search**: < 100ms search results
- **Storage Efficiency**: Handle 1000+ prompts efficiently
- **Memory Usage**: < 50MB RAM usage

## 4. Technical Architecture

### 4.1 Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | React 18 + TypeScript | Type safety, component reusability |
| Build Tool | Vite | Fast development, optimized builds |
| Styling | CSS Modules + Tailwind | Scoped styles, consistent design |
| Search | Fuse.js | Lightweight, fast full-text search |
| Markdown | marked.js + highlight.js | Fast parsing, syntax highlighting |
| Storage | Chrome Extension Storage API | Local persistence, sync capability |

### 4.2 Data Structures

```typescript
interface Prompt {
  id: string;                    // UUID v4
  title: string;                 // Prompt title
  content: string;               // Markdown content
  tags: string[];               // Tag array
  createdAt: Date;              // Creation timestamp
  category?: string;            // Optional legacy support
}

interface AppState {
  prompts: Prompt[];           // All prompts
  searchQuery: string;          // Current search term
  selectedTags: string[];       // Active tag filters
  viewMode: 'list' | 'edit' | 'preview';  // Current view
  theme: 'light' | 'dark';     // UI theme
}

interface SearchIndex {
  prompts: IndexedPrompt[];     // Search-optimized prompts
  tags: Set<string>;            // All available tags
}
```

### 4.3 Data Flow

1. **Storage Layer**: Chrome Extension APIs
   - `chrome.storage.local` for prompts (10MB limit)
   - `chrome.storage.sync` for settings (8KB limit)
   - IndexedDB fallback for large datasets

2. **State Management**: React hooks
   - `useState` for component state
   - `useEffect` for storage operations
   - Custom hooks for search logic

3. **Search Index**: Fuse.js
   - Pre-built index on app load
   - Real-time search with debouncing
   - Tag filtering integration

## 5. Non-Functional Requirements

### 5.1 Performance
- **Load Time**: < 500ms for popup initialization
- **Search Response**: < 100ms for search results
- **Memory Usage**: < 50MB RAM
- **Storage**: Efficient handling of 1000+ prompts

### 5.2 Usability
- **Responsive Design**: Works on different screen sizes
- **Keyboard Navigation**: Full keyboard support
- **Internationalization**: Ready for i18n implementation

## 6. Chrome Extension Specifics

### 6.1 Manifest Configuration

```json
{
  "manifest_version": 3,
  "name": "Prompt Manager",
  "version": "1.0.0",
  "description": "Store and organize LLM prompts with local storage",
  "permissions": [
    "storage"
  ],
  "action": {
    "default_popup": "index.html",
    "default_title": "Prompts&Notes"
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

### 6.2 Storage Strategy

- **Primary Storage**: `chrome.storage.local`
- **Settings Sync**: `chrome.storage.sync`
- **Fallback**: IndexedDB for large datasets
- **Backup**: Export functionality for data safety

### 6.3 Performance Optimization

- **Search Indexing**: Pre-built Fuse.js index
- **Virtual Scrolling**: For large prompt lists
- **Debouncing**: Search input and auto-save
- **Lazy Loading**: Markdown preview on demand

## 7. Testing Strategy

### 7.1 Unit Testing
- **Components**: React component testing
- **Utilities**: Helper functions and utils
- **Storage**: Chrome storage mock testing
- **Search**: Search algorithm validation

### 7.2 Integration Testing
- **Search Functionality**: Full-text search and filtering
- **Export Features**: All export format testing
- **UI Interactions**: User flow validation

---

**Document Status**: Draft
**Version**: 1.0
**Last Updated**: 2025-09-13
**Next Review**: After MVP completion