import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import "./index.css";
import type { Route } from "./+types/root";
import { GlobalErrorPage } from "./pages/GlobalErrorPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <p role="status">Loading BetSphere...</p>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFoundPage />;
  }
  return <GlobalErrorPage />;
}
