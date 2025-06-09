# User Management System Frontend

A modern user management system built with React, Tailwind CSS, and Vite.

## Features

- 📊 Dashboard with user statistics and recent activity
- 👥 User management (list, create, update, delete)
- 🔐 User authentication and authorization
- 🎨 Modern and responsive UI with dark mode support
- ⚡ Fast development with Vite
- 🎯 Type-safe development with ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-system/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── App.jsx        # Main application component
│   ├── index.css      # Global styles and Tailwind directives
│   └── main.jsx       # Application entry point
├── public/            # Static assets
├── index.html         # HTML template
├── package.json       # Project dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Hero Icons](https://heroicons.com/)
- [React Router](https://reactrouter.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [Axios](https://axios-http.com/)
