export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  read_time: number
  published: boolean
  created_at: string
  updated_at: string
  series_id?: number
  order_in_series?: number
  series_title?: string
  series_slug?: string
}

export interface Series {
  id: string
  title: string
  slug: string
  posts?: Post[]
}


export const posts: Post[] = [
  {
    id: '1',
    title: 'Welcome to CodeWars Blog',
    slug: 'welcome-to-codewars-blog',
    content: `# Welcome to Our Blog

This is a modern blog platform inspired by CodeWars design. Here you can share your thoughts, experiences, and knowledge with the community.

## Features

- Clean and minimal design
- Easy to read content
- Category filtering
- Tag support
- Fast and responsive

Start exploring the articles and enjoy reading!`,
    excerpt: 'Welcome to our blog platform inspired by CodeWars. Share and discover great content.',
    author: 'Admin',
    category: 'announcement',
    tags: ['welcome', 'blog', 'introduction'],
    read_time: 3,
    published: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Getting Started with Vue 3',
    slug: 'getting-started-with-vue-3',
    content: `# Getting Started with Vue 3

Vue 3 brings many improvements and new features that make building modern web applications easier and more efficient.

## Composition API

The Composition API is one of the biggest additions to Vue 3. It provides a new way to organize component logic.

\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    return { count, doubled }
  }
}
\`\`\`

## Performance

Vue 3 is significantly faster than Vue 2 with improved virtual DOM and tree-shaking support.

## TypeScript Support

Vue 3 has excellent TypeScript support out of the box, making it easier to build type-safe applications.`,
    excerpt: 'Learn about the new features and improvements in Vue 3, including the Composition API and performance enhancements.',
    author: 'John Doe',
    category: 'tutorials',
    tags: ['vue', 'javascript', 'tutorial'],
    read_time: 8,
    published: true,
    created_at: '2025-01-10T14:30:00Z',
    updated_at: '2025-01-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'TypeScript Best Practices',
    slug: 'typescript-best-practices',
    content: `# TypeScript Best Practices

TypeScript has become the standard for building robust JavaScript applications. Here are some best practices to follow.

## Use Strict Mode

Always enable strict mode in your tsconfig.json:

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## Type Everything

Avoid using \`any\` type. Instead, use proper types or \`unknown\` when the type is truly unknown.

## Interface vs Type

Use interfaces for object shapes and types for unions, intersections, and primitives.

## Utility Types

Take advantage of TypeScript's utility types like Partial, Pick, Omit, and Record.`,
    excerpt: 'Essential TypeScript best practices for writing maintainable and type-safe code.',
    author: 'Jane Smith',
    category: 'programming',
    tags: ['typescript', 'javascript', 'best-practices'],
    read_time: 6,
    published: true,
    created_at: '2025-01-05T09:15:00Z',
    updated_at: '2025-01-05T09:15:00Z'
  },
  {
    id: '4',
    title: 'Mastering Tailwind CSS',
    slug: 'mastering-tailwind-css',
    content: `# Mastering Tailwind CSS

Tailwind CSS is a utility-first CSS framework that makes styling applications fast and efficient.

## Why Tailwind?

- Rapid development
- Consistent design system
- No naming conventions needed
- Responsive by default

## Custom Themes

You can customize Tailwind to match your brand colors and design system.

## Best Practices

- Use @apply sparingly
- Leverage component extraction
- Keep utilities atomic
- Use the JIT compiler`,
    excerpt: 'Master the art of using Tailwind CSS to build beautiful, responsive interfaces quickly.',
    author: 'Mike Johnson',
    category: 'tutorials',
    tags: ['css', 'tailwind', 'design'],
    read_time: 7,
    published: true,
    created_at: '2025-01-12T16:45:00Z',
    updated_at: '2025-01-12T16:45:00Z'
  },
  {
    id: '5',
    title: 'Building Scalable Applications',
    slug: 'building-scalable-applications',
    content: `# Building Scalable Applications

Scalability is crucial for modern web applications. Here's how to build apps that grow with your users.

## Architecture Patterns

- Microservices
- Serverless
- Event-driven design
- CQRS

## Performance Optimization

- Code splitting
- Lazy loading
- Caching strategies
- CDN usage

## Database Scaling

- Read replicas
- Sharding
- NoSQL vs SQL
- Connection pooling`,
    excerpt: 'Learn the principles and patterns for building applications that scale to millions of users.',
    author: 'Sarah Williams',
    category: 'programming',
    tags: ['architecture', 'scalability', 'performance'],
    read_time: 10,
    published: true,
    created_at: '2025-01-08T11:20:00Z',
    updated_at: '2025-01-08T11:20:00Z'
  },
  {
    id: '6',
    title: 'The Future of Web Development',
    slug: 'future-of-web-development',
    content: `# The Future of Web Development

The web development landscape is constantly evolving. Here's what's coming next.

## Emerging Technologies

- WebAssembly
- Edge computing
- AI-powered development
- Web3 integration

## Framework Evolution

Modern frameworks are getting faster, smaller, and more powerful. The future is looking bright!

## Developer Experience

Tools are becoming more intuitive, making it easier than ever to build amazing web applications.`,
    excerpt: 'Explore the trends and technologies that will shape the future of web development.',
    author: 'David Chen',
    category: 'announcement',
    tags: ['future', 'trends', 'technology'],
    read_time: 5,
    published: true,
    created_at: '2025-01-14T13:00:00Z',
    updated_at: '2025-01-14T13:00:00Z'
  }
]
