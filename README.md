# Rick and Morty Explorer

A Next.js application that allows users to explore characters from the Rick and Morty universe. Built as part of the Leonardo.Ai coding challenge (v3.5).

## Features

- **User Authentication**: Blocking modal that requires username and job title before accessing content
- **Persistent User Data**: User information stored in localStorage and editable at any time
- **Character Explorer**: Browse Rick and Morty characters with images via GraphQL API
- **Pagination**: Navigate through character pages with URL-based pagination for direct linking
- **Character Details**: View detailed character information in an accessible modal
- **Responsive Design**: Optimized for both mobile and desktop devices

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **GraphQL Client**: Apollo Client
- **API**: [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Home page
│   └── characters/       # Characters page with pagination
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions and configurations
└── public/               # Static assets
```

## Challenge Version

**v3.5** - Leonardo.Ai Web Team Challenge

## Deployment

Deployed on [Vercel](https://vercel.com).
