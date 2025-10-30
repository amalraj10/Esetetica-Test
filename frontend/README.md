# Cart Flow & Appointments (Frontend)

Author: Amalraj PM (MERN Stack Developer)

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- TanStack Query

## Dev Setup
```sh
cd frontend
npm install
npm run dev
# App will run at http://localhost:8080
```

## API Base
The frontend expects the backend at:
```
VITE_API_BASE=http://localhost:4000
```
Set this in `frontend/.env` if needed.

## Features
- Product search and filter by category
- Cart with server sync per user (localStorage userId)
- Appointment completion with server-calculated billing and invoice

## Folders
- components/ – UI components
- pages/ – Routes (Products, OrderCompletion)
- lib/ – API client and helpers
- hooks/ – Shared hooks

## Scripts
- `npm run dev` – Start Vite
- `npm run build` – Production build

