# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Product Feedback App built with Angular 19, using Nx monorepo architecture. The application enables users to submit product suggestions, vote on them, add comments and replies, and track their progress through different statuses (planned, in-progress, live).

## Development Commands

### Core Commands
- `nx serve product-feedback-app-v2` - Start development server (http://localhost:4200)
- `nx build product-feedback-app-v2` - Build the application
- `nx test product-feedback-app-v2` - Run unit tests for main app
- `nx lint product-feedback-app-v2` - Lint the main application
- `nx run-many -t test` - Run tests for all projects
- `nx run-many -t lint` - Lint all projects
- `nx run-many -t build` - Build all projects

### Library Commands
- `nx test [library-name]` - Run tests for specific library (e.g., `nx test core-state`)
- `nx lint [library-name]` - Lint specific library
- `nx build [library-name]` - Build specific library

### E2E Testing
- `nx e2e e2e` - Run Playwright end-to-end tests

## Architecture Overview

### Monorepo Structure
The project uses Nx workspace with these key libraries:

- **api-interfaces**: Shared TypeScript interfaces and types
- **app-config**: Application configuration management with injection token
- **core-data**: Data services and HTTP client logic
- **core-state**: NgRx Signals-based state management
- **shared**: Reusable UI components and utilities

### State Management Pattern
The application uses NgRx Signals with a facade pattern:

1. **Services** (`core-data`): Handle HTTP operations and caching
2. **Stores** (`core-state`): Manage application state using `signalStore` with:
   - `withLoading()` - Loading state utilities
   - `withError()` - Error handling utilities  
   - `withService()` - Service integration
   - `rxMethod()` - Reactive method handling
3. **Facades** (`core-state`): Provide clean API to components with computed selectors

### Key State Management Files
- `libs/core-state/src/lib/stores/suggestions/suggestions.store.ts` - Main suggestions state
- `libs/core-state/src/lib/facades/suggestions-facade.ts` - Component interface
- `libs/core-data/src/lib/services/suggestions/suggestion.service.ts` - HTTP service with caching

### Angular Configuration
- Uses **zoneless change detection** (`provideExperimentalZonelessChangeDetection`)
- **Server-side rendering** enabled with hydration
- **Hover preloading** strategy for route optimization
- **SCSS** for styling with global styles in `src/app/global-styles/`

### Application Structure
- **Domains**: Feature modules organized by business domain (`road-map`, `suggestions`)
- **Components**: Smart/dumb component pattern with shared components in `libs/shared`
- **Routing**: Lazy-loaded routes with preloading strategies
- **Forms**: Reactive forms with custom validation directives

### Data Flow
1. Components inject facade services
2. Facades expose computed signals and trigger store methods  
3. Store methods use `rxMethod` for reactive operations
4. Services handle HTTP requests with caching via `Map<number, Suggestion>`
5. State updates propagate through signals to components

### Development Guidelines
- Libraries follow strict dependency boundaries enforced by Nx
- Use facade pattern to access state (don't inject stores directly in components)
- HTTP services implement caching strategies for performance
- All async operations use RxJS with proper error handling via `tapResponse`
- State mutations only through store methods, never direct patchState in components