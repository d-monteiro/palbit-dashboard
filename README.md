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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8e4d799d-29ca-4d3c-aad1-cc6817bd599f) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
