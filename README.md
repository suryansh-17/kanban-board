# Jira Board Clone

A modern, responsive Kanban board application built with Next.js, TypeScript, and Redux Toolkit. This project implements a Jira-like task management system with drag-and-drop functionality, real-time updates, and persistent storage.

## Features

- 📱 Responsive design that works on both desktop and mobile devices
- 🎯 Drag-and-drop task management
- 📝 Create, edit, and delete tasks
- 🔄 Real-time state management with Redux
- 💾 Persistent storage using localStorage
- 🌓 Dark mode support
- 🎨 Modern UI with Tailwind CSS
- ⚡ Smooth animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Icons**: Lucide Icons
- **Notifications**: Sonner

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # React components
│   └── kanban/        # Kanban board specific components
├── store/             # Redux store configuration
├── types/             # TypeScript type definitions
└── lib/               # Utility functions and configurations
```

## Core Components

### KanbanBoard

The main component that renders the Kanban board. It handles:

- Task drag and drop functionality
- Touch interactions for mobile devices
- Column management
- Task CRUD operations

### TaskModal

A reusable modal component for creating and editing tasks. Features:

- Form validation
- Real-time updates
- Column selection
- Date formatting

## State Management

The application uses Redux Toolkit for state management with the following structure:

### KanbanState

```typescript
interface KanbanState {
  tasks: Task[];
  columns: Column[];
}
```

### Key Actions

- `initialize`: Load initial state from localStorage
- `addTask`: Create a new task
- `updateTask`: Modify existing task
- `deleteTask`: Remove a task
- `moveTask`: Change task's column
- `reorderTasks`: Reorder tasks within a column
- `resetBoard`: Clear all tasks

## Data Persistence

The application automatically saves the state to localStorage whenever changes occur. The persistence logic includes:

1. Loading saved state on application start
2. Saving state changes to localStorage
3. Error handling for storage operations

## Mobile Support

The application includes special handling for mobile devices:

- Touch event handling for drag and drop
- Responsive layouts
- Mobile-optimized UI components
- Touch-friendly interactions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
