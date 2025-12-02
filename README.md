# Rick and Morty Explorer

A Next.js application that allows users to explore characters from the Rick and Morty universe. Built as part of the Leonardo.Ai coding challenge (v3.5).

## Features

- **User Onboarding**: Welcome page that collects username and job title before accessing content
- **Persistent User Data**: User information stored in localStorage and editable via profile dropdown
- **Character Explorer**: Browse Rick and Morty characters with paginated grid view
- **Dynamic Routing**: URL-based pagination (`/information/1`, `/information/2`) for direct linking
- **Character Details**: View detailed character information including episodes in an accessible modal
- **Loading Skeletons**: Smooth loading states that prevent layout shift
- **Responsive Design**: Optimized for both mobile and desktop devices

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **GraphQL Client**: Apollo Client
- **API**: [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql)
- **Code Generation**: GraphQL Codegen for type-safe queries

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd leonardo-challenge

# Install dependencies
pnpm install

# Generate GraphQL types
pnpm codegen

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm codegen` | Generate GraphQL types |

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home redirect
│   ├── welcome/              # User onboarding page
│   └── information/          
│       ├── page.tsx          # Redirect to page 1
│       └── [pageNumber]/     # Dynamic paginated route
├── components/
│   ├── character/            # Character-related components
│   │   ├── card.tsx          # Character card
│   │   ├── list.tsx          # Character grid with pagination
│   │   └── modal.tsx         # Character detail modal
│   ├── layout/               # Layout components (Header, Footer)
│   ├── providers/            # Context providers
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── contexts/             # React contexts (User)
│   ├── graphql/              # GraphQL queries and types
│   └── apollo-client.ts      # Apollo Client configuration
└── public/                   # Static assets
```

## Challenge Version

**v3.5** - Leonardo.Ai Web Team Challenge
