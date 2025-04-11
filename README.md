# Second Brain - Project Readme

## Overview
Second Brain is a knowledge management application that allows users to organize, store, and retrieve information efficiently. Users can create collections and within those collections, add various types of content with automatic summarization capabilities.

## Key Features

### Content Management
- Create collections to organize your knowledge
- Add content items with:
  - Title
  - Description
  - Content type (WEBPAGE, YOUTUBE, CODE, or NOTE)
  - Main content
- Automatic summarization for different content types:
  - YouTube video summaries
  - Webpage summaries
  - Code explanations
  - Note condensation

### Powerful Search
- Semantic search functionality
- Find content by describing what you're looking for
- Search across all your collections and content items

### Content Display
- View complete content details including:
  - Title
  - Description
  - Content type
  - Main content
  - Generated summary

## Technology Stack

### Backend
- **Next.js** API routes
- **Prisma** ORM for database operations
- **PostgreSQL** with **pgvector** for vector storage and semantic search
- **Clerk** for authentication and user management

### Frontend
- **Next.js** (React framework)
- **TypeScript** for type safety
- Modern React hooks and components

### AI Integration
- **Gemini** for content summarization and semantic search capabilities

