# Palbit Dashboard

## Development

```bash
npm run dev
```

## Building for Desktop (Electron)

To build the desktop application:

```bash
# First build the React application
npm run build

# Then build the Electron application
node scripts/build-electron.js
```

The built application will be available in the `electron-dist` folder.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS