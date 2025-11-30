# Process Review Application

## Overview

A hierarchical data review application for pharmaceutical manufacturing processes built for the Innerspace Frontend Mini-Challenge. This application provides a guided review workflow for verifying correctness, approving items, flagging issues, and leaving traceable comments on process models.

![Process Review Application](/public/main.jpg)

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Challenge Implementation](#challenge-implementation)
- [Component Library](#component-library)
- [Technical Specifications](#technical-specifications)
- [Design System](#design-system)
- [Data Management](#data-management)
- [Development Decisions](#development-decisions)

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install

npm run dev
```

The application will be available at `http://localhost:3000`

## Architecture

### Project Structure

```
app/
├── layout.tsx                  # Root layout with providers
├── page.tsx                   # Main review interface
├── not-found.tsx              # 404 page
├── providers.tsx              # React Query provider
├── globals.css                # Global styles
└── api/
    └── processes/
        └── route.ts           # Next.js API route for mock data

src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sonner.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── tooltip.tsx
│   │   └── use-toast.ts
│   ├── Dashboard.tsx          # Main dashboard view
│   ├── ProcessList.tsx        # Process selection component
│   ├── SubprocessList.tsx     # Subprocess selection component
│   ├── TaskList.tsx           # Task detail component
│   ├── StatusBadge.tsx        # Reusable status indicator
│   ├── StatusControl.tsx      # Status change controls
│   ├── CommentSection.tsx     # Comment display/input
│   ├── ReviewStepper.tsx      # Step-by-step navigation component
│   ├── FinalConfirmation.tsx  # Review completion summary
│   ├── StatCard.tsx           # Reusable statistics card component
│   ├── Breadcrumb.tsx         # Navigation breadcrumb
│   ├── SearchFilter.tsx       # Search and filter controls
│   ├── BulkActions.tsx        # Bulk operation controls
│   ├── DetailedDataView.tsx  # Detailed item view
│   └── ErrorBoundary.tsx      # Error boundary component
├── data/
│   └── processes.json        # Synthetic manufacturing data
├── lib/
│   ├── mockApi.ts            # Mock API service
│   ├── storage.ts            # localStorage utilities
│   ├── utils.ts              # Helper functions
│   └── export.ts             # Export utilities (PDF/CSV)
├── hooks/
│   ├── useProcessState.ts    # Process state management hook
│   └── useProcessFilter.ts   # Process filtering hook
└── types/
    └── data.ts               # TypeScript interfaces
```

### Technology Stack

| Category         | Technology   | Version | Purpose                         |
| ---------------- | ------------ | ------- | ------------------------------- |
| Framework        | Next.js      | 15      | React framework with App Router |
| Language         | TypeScript   | Latest  | Type-safe development           |
| UI Library       | shadcn/ui    | Latest  | Component library               |
| Styling          | Tailwind CSS | Latest  | Utility-first CSS               |
| State Management | React Query  | Latest  | Server state management         |
| Icons            | Lucide React | Latest  | Icon library                    |
| Date Handling    | date-fns     | Latest  | Date formatting utilities       |
| Charts           | Recharts     | Latest  | Data visualization              |

## Component Library

### shadcn/ui Base Components

The application uses [shadcn/ui](https://ui.shadcn.com/docs/components) as the base component library. All base UI components are located in `src/components/ui/` and are installed via the shadcn/ui CLI.

**Reference Documentation**: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

**Installed Components**:

- `badge` - Status indicators
- `button` - Interactive buttons
- `card` - Container components
- `checkbox` - Selection controls
- `collapsible` - Expandable sections
- `dialog` - Modal dialogs
- `dropdown-menu` - Dropdown menus
- `input` - Text input fields
- `progress` - Progress indicators
- `select` - Select dropdowns
- `separator` - Visual dividers
- `sonner` - Toast notifications
- `textarea` - Multi-line text input
- `toast` - Toast notification system
- `tooltip` - Hover tooltips

These components are:

- **Customizable**: Fully editable source code in `src/components/ui/`
- **Accessible**: Built on Radix UI primitives with accessibility built-in
- **Themeable**: Styled with Tailwind CSS and CSS variables

### Custom Application Components

All custom components extend or compose shadcn/ui base components:

| Component           | Purpose                          | Location                               |
| ------------------- | -------------------------------- | -------------------------------------- |
| `StatCard`          | Reusable statistics display card | `src/components/StatCard.tsx`          |
| `StatusBadge`       | Color-coded status indicator     | `src/components/StatusBadge.tsx`       |
| `StatusControl`     | Three-button status selector     | `src/components/StatusControl.tsx`     |
| `CommentSection`    | Comment display and input        | `src/components/CommentSection.tsx`    |
| `ReviewStepper`     | Step-by-step navigation          | `src/components/ReviewStepper.tsx`     |
| `FinalConfirmation` | Review completion summary        | `src/components/FinalConfirmation.tsx` |
| `ProcessList`       | Process selection list           | `src/components/ProcessList.tsx`       |
| `SubprocessList`    | Subprocess selection list        | `src/components/SubprocessList.tsx`    |
| `TaskList`          | Task detail list                 | `src/components/TaskList.tsx`          |
| `Dashboard`         | Main dashboard view              | `src/components/Dashboard.tsx`         |

## Challenge Implementation

### Level 1 - Core Features


1. **Synthetic Dataset Generation**

   - **AI Tool Used**: Claude (via Cursor AI assistant)
   - **Prompt Used to generate processes data**: "Requested generation of realistic pharmaceutical manufacturing process data with hierarchical structure (Process → Subprocess → Task), including 2-3 processes, each with 2-4 subprocesses, and each subprocess with 3-6 tasks. Specified required fields: id, name, description, status (Pending/Approved/Needs Fix), lastUpdatedBy, lastUpdatedAt. Emphasized realism for pharma manufacturing domain (API production, sterile fill-finish, solid dosage forms)."
   
   - **Manual Adjustments**:
     - Validated all IDs follow consistent naming pattern (proc-XXX, subproc-XXX-XXX, task-XXX-XXX-XXX)
     - Ensured status distribution across items for realistic initial state
     - Verified timestamps follow logical chronological order
     - Added realistic pharmaceutical terminology and workflow descriptions
     - Confirmed all required fields present in every item
   - **Dataset**: 3 pharmaceutical processes with realistic manufacturing workflows
   - **Structure**:
     - Process 1: API Manufacturing (4 subprocesses, 18 total tasks)
     - Process 2: Sterile Fill-Finish (3 subprocesses, 15 total tasks)
     - Process 3: Solid Dosage Manufacturing (3 subprocesses, 13 total tasks)
   - **Fields**: All required fields included (id, name, description, status, lastUpdatedBy, lastUpdatedAt)
   - **Location**: `src/data/processes.json`

2. **Mocked API**

   - **Implementation**: Next.js API route at `/api/processes` (App Router)
   - **Location**: `app/api/processes/route.ts`
   - **Client**: `src/lib/mockApi.ts` - Client-side API service
   - **Features**:
     - Simulated 500ms network delay for realistic UX
     - Returns Promise-based data via fetch
     - Error handling support
     - Proper Next.js API route structure
   - **Integration**: React Query for data fetching with loading and error states

3. **Guided Review Flow**

   - **Three-column layout** for progressive drill-down:
     - Column 1: Process selection with progress indicators
     - Column 2: Subprocess selection (appears when process selected)
     - Column 3: Task details (appears when subprocess selected)
   - **Progress tracking**: Shows "X/Y tasks approved" at each level
   - **Breadcrumb navigation**: Back button to navigate up the hierarchy
   - **Visual feedback**: Active selections highlighted with border and background

4. **Comments & Audit Trail**

   - **Multi-level commenting**: Add comments at Process, Subprocess, or Task level
   - **Comment fields**: text, user (hardcoded as "Reviewer 1"), timestamp
   - **Audit display**: Newest comments first with relative timestamps
   - **Auto-updates**: lastUpdatedBy and lastUpdatedAt fields update automatically

5. **Local Persistence**
   - **Storage**: localStorage-based persistence
   - **Features**:
     - Automatic save on every change
     - Merge stored state with fresh data on load
     - Preserves all status changes and comments
     - Reset functionality to clear all data
   - **Implementation**: `src/lib/storage.ts` with merge logic

### Level 2 - Extra Features

**A) Stronger Guidance**:

- **ReviewStepper Component**: Visual stepper showing the 4-step review process:
  - Step 1: Process Overview - Select and review processes
  - Step 2: Subprocess Review - Review subprocesses (requires process selection)
  - Step 3: Task Review - Review individual tasks (requires subprocess selection)
  - Step 4: Final Confirmation - Confirm review completion
- **Step Validation**: Prevents skipping required steps with visual indicators
  - Blocked steps shown with warning icon
  - Completed steps marked with checkmark
  - Current step highlighted with primary color

**C) Reusable Components**:

- **`StatCard`**: Reusable statistics card component with configurable color variants, icons, and tooltips. Used in Dashboard for displaying metrics (Total Tasks, Approved, Pending, Needs Fix).
- **`StatusBadge`**: Color-coded status indicator with icons for visual status representation
- **`StatusControl`**: Three-button status selector (Pending/Approved/Needs Fix) with visual feedback
- **`CommentSection`**: Unified comment display and input with audit trail
- **`ProcessList`**, **`SubprocessList`**, **`TaskList`**: Hierarchical navigation components with collapsible sections
- **`ReviewStepper`**: Step-by-step navigation component with validation
- **`FinalConfirmation`**: Review completion summary component with statistics
- **Design System**: Consistent theming via Tailwind config and CSS variables

## Technical Specifications

### API Layer

**Mock API Implementation** (`src/lib/mockApi.ts`):

- Simulates network delay (500ms) for realistic UX
- Returns Promise-based data structure
- Error handling support
- Type-safe with TypeScript interfaces

**Next.js API Route** (`app/api/processes/route.ts`):

- Server-side route handler
- Reads from static JSON file
- Returns JSON response with proper headers

### State Management

**React Query** (`@tanstack/react-query`):

- Handles server state (process data)
- Automatic caching and refetching
- Loading and error states
- Query invalidation on mutations

**Local State** (`useState`):

- UI state (selections, filters, search)
- Step navigation state
- Modal/dialog visibility

**Custom Hooks**:

- `useProcessState`: Centralized process state management
- `useProcessFilter`: Filtering logic for processes

### Data Persistence

**localStorage Strategy** (`src/lib/storage.ts`):

- Key: `process-review-state`
- Automatic save on every state change
- Merge strategy: Fresh API data + stored changes
- Type-safe serialization/deserialization

## Design System

### Color Palette

The application uses CSS variables defined in `app/globals.css` for theming:

| Variable             | Color                | Usage                           |
| -------------------- | -------------------- | ------------------------------- |
| `--primary`          | #3B82F6 (Blue)       | Main brand color, active states |
| `--success`          | #22C55E (Green)      | Approved items, success states  |
| `--destructive`      | #EF4444 (Red)        | Needs Fix items, error states   |
| `--pending`          | #6B7280 (Gray)       | Pending review items            |
| `--background`       | #F8FAFC (Light Gray) | Page background                 |
| `--foreground`       | #0F172A (Dark)       | Text color                      |
| `--muted`            | #F1F5F9              | Muted backgrounds               |
| `--muted-foreground` | #64748B              | Muted text                      |

### Typography

- **Headings**: Inter font family, bold weights
- **Body**: System font stack with Inter fallback
- **Code**: monospace

### Component Variants

- **Status Badges**: Color-coded with icons (CheckCircle2, Clock, AlertCircle)
- **Cards**: Hover effects, border-left accent colors
- **Buttons**: Primary, outline, ghost variants
- **Inputs**: Consistent styling with focus states
- **Tooltips**: Accessible hover tooltips via Radix UI

## Data Management

### Data Flow Architecture

```
┌─────────────┐
│  Mock API   │ (app/api/processes/route.ts)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ React Query │ (Server State Management)
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Fresh     │ ───▶ │ localStorage │
│   Data      │      │   (Merge)    │
└──────┬──────┘      └──────────────┘
       │
       ▼
┌─────────────┐
│   Merged    │
│   State     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Components │
└─────────────┘
```

### localStorage Implementation

**Storage Key**: `process-review-state`

**Data Structure**:

```typescript
{
  processes: Process[];
  lastSync: string; // ISO timestamp
}
```

**Merge Strategy**:

1. Fetch fresh data from API
2. Load stored state from localStorage
3. Deep merge: Preserve user changes (status, comments) while updating with fresh data structure
4. Handle new items: Add to stored state
5. Handle removed items: Remove from stored state

**Sync Behavior**:

- Automatic save on every state mutation
- Debounced writes (immediate in current implementation)
- Error handling for quota exceeded scenarios

### Data Types

**Process Hierarchy**:

```typescript
Process {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  comments: Comment[];
  subprocesses: Subprocess[];
}

Subprocess {
  // Similar structure with tasks array
  tasks: Task[];
}

Task {
  // Leaf node in hierarchy
}
```

## Features Highlight

### User Experience

- **Responsive Design**: Works on desktop and tablet
- **Loading States**: Spinner during data fetch
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Immediate feedback on actions
- **Relative Timestamps**: "5 minutes ago" style timestamps

### Review Workflow

- **Guided step-by-step flow**: Process Overview → Subprocess Review → Task Review → Final Confirmation
- **Step validation**: Prevents skipping required steps with clear warnings
- **Top-down navigation**: Process → Subprocess → Task
- **Progress tracking**: Visual indication of completion at each step
- **Status management**: Quick status changes with visual feedback
- **Comment system**: Full audit trail at all levels
- **Data persistence**: No data loss on page refresh
- **Final confirmation**: Comprehensive review summary before completion

## Development Decisions

### API Mocking

- **Chosen**: Simple Promise-based mock service
- **Alternative**: MSW (Mock Service Worker)
- **Reasoning**: Lighter weight, sufficient for the challenge scope

### State Management

- **Chosen**: React Query + useState
- **Alternative**: Redux, Zustand, or Context API
- **Reasoning**: React Query handles server state, local useState for UI state is sufficient

### Storage

- **Chosen**: localStorage with merge strategy
- **Alternative**: IndexedDB or backend persistence
- **Reasoning**: Simple, synchronous, sufficient for demo scope

### Component Library

- **Chosen**: shadcn/ui
- **Reasoning**:
  - Copy-pasteable components allow full customization
  - Built on Radix UI for accessibility
  - Tailwind CSS integration for consistent styling
  - Reference: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

### Code Organization

- **Chosen**: Feature-based component organization
- **Reasoning**:
  - Clear separation between base UI components (`ui/`) and application components
  - Easy to locate and maintain components
  - Follows Next.js App Router conventions
  - Reusable components extracted to reduce duplication (e.g., `StatCard`)

## If I had 1–2 more days these would be future enhancements

### Level 3 Features

1. **Review Completeness Checks**

   - Block "Finalize Review" until all required items reviewed
   - Show list of remaining pending items
   - Validation warnings before submission

2. **Diff/Correctness Support**

   - Highlight items marked "Needs Fix"
   - Reference data comparison view
   - Change tracking and history

3. **A11y & UX Finesse**
   - Full keyboard navigation
   - ARIA labels and roles
   - Focus management
   - Screen reader optimization

### Additional Improvements

4. **Collaboration**

   - Multiple reviewer support
   - Real-time updates (WebSocket)
   - Review assignment system
   - Conflict resolution

5. **Analytics**

   - Review time tracking
   - Completion metrics dashboard
   - Reviewer performance stats
   - Bottleneck identification

6. **Testing**

   - Unit tests for components
   - Integration tests for workflows
   - E2E tests with Playwright
   - Accessibility testing

7. **Performance**
   - Virtual scrolling for large datasets
   - Debounced auto-save
   - Optimistic UI updates
   - Service worker for offline support

## References

- **shadcn/ui Documentation**: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **React Query Documentation**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **Tailwind CSS Documentation**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
