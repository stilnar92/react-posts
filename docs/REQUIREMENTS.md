# React UI Challenge - Requirements

## Project Objective

Build a clean, functional, and well-structured React UI using Tailwind CSS. The goal is to evaluate your ability to structure components, handle data fetching and interactivity, and write clear and modular code.

## Overview

Using the JSONPlaceholder API, build a simple React application that displays a list of posts from the following endpoint:

```
https://jsonplaceholder.typicode.com/posts
```

### Post Data Structure

Each post includes the following fields:
- `userId` (number)
- `id` (number) 
- `title` (string)
- `body` (string)

## Core Functionality

Your application should:

1. **Fetch and display** the list of posts
2. **Show each post** in a list format (see mocks below)
3. **Allow the user to click** on a post to reveal a detailed view
4. **Include basic loading and error states** - display appropriate messages during data fetching

## Technical Requirements

### Framework & Libraries
- ✅ **React** with functional components
- ✅ **React Hooks** (useState, useEffect)
- ✅ **Tailwind CSS** for styling (no other styling libraries should be used)

### Code Structure & Quality
- ✅ Create **at least one custom hook** (e.g., for fetching data)
- ✅ Structure code using **clearly separated components**
- ✅ Include **inline comments** where necessary to explain decisions or non-obvious logic
- ✅ Keep **project structure clean and organized**

### User Experience
- ✅ Display **appropriate messages** during loading and error states
- ✅ **Responsive design** that works on different screen sizes

## Stretch Goals (Optional)

If time allows, you may optionally add:

- 🎯 **Search functionality** - A search input that filters the posts by title or body content
- 🎯 **User filter** - A dropdown filter to show posts by a selected userId

> **Note**: The stretch goal is not required but will be considered a plus if implemented cleanly.

## Submission Instructions

### Deliverables
1. **ZIP file** of your completed project directory
2. **Screen recording** (5 minutes or less) walking through:
   - The UI and how to interact with it
   - An overview of the code structure and key decisions

### Timeline
- **Completion time**: You are expected to complete and return the assignment within 24 hours of receiving it

## Requirements Checklist

### Core Features
- [ ] Fetch posts from JSONPlaceholder API
- [ ] Display posts in a list format
- [ ] Implement post detail view on click
- [ ] Add basic loading state during data fetching
- [ ] Add error state handling
- [ ] Use functional components with hooks
- [ ] Implement at least one custom hook
- [ ] Use Tailwind CSS for all styling (no other styling libraries)

### Code Quality
- [ ] Clean component structure
- [ ] Proper separation of concerns
- [ ] Inline comments for complex logic
- [ ] Organized project structure
- [ ] Responsive design
- [ ] Appropriate loading and error messages

### Optional Features
- [ ] Search functionality (filters by title or body content)
- [ ] User filter dropdown (shows posts by selected userId)

## API Reference

### Endpoint
```
GET https://jsonplaceholder.typicode.com/posts
```

### Response Format
```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  }
]
```

## Success Criteria

A successful submission will demonstrate:
- **Clean, readable code** with proper React patterns
- **Effective use of Tailwind CSS** for styling (no other styling libraries)
- **Proper error handling** and loading states
- **Good component architecture** and separation of concerns
- **Responsive design** that works across devices
- **Clear documentation** and inline comments where needed
- **At least one custom hook** implementation
- **Well-organized project structure** 