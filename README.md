# ContributionHub

A platform to help developers discover and contribute to open-source projects.

## Table of Contents
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Development](#development)
- [API Documentation](#api-documentation)

## Installation

Follow these steps to set up the project on your localhost system:

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ContributionHub
```

#### 2. Install Dependencies
```bash
npm install
```

Or if you prefer using yarn:
```bash
yarn install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following:

```env
VITE_BACKEND_URL=http://localhost:5000
```

**Environment Variables Explanation:**
- `VITE_BACKEND_URL` - The URL of your backend API server (default: http://localhost:5000)

#### 4. Start the Development Server
```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The application will start on `http://localhost:5173` (default Vite port). Open your browser and navigate to this URL.

### Build for Production

To create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build Locally

To preview the production build on localhost:
```bash
npm run preview
```

## Project Structure

```
ContributionHub/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── assets/          # Static assets
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Public static files
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

### Tech Stack

- **React** 18.2.0 - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## API Documentation

For detailed information about API endpoints and their usage, please refer to the [API Documentation](./API_DOCS.md).

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the correct URL.

### Dependency Issues
If you encounter dependency issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
Clear the cache and rebuild:
```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
