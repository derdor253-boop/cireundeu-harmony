import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const App = lazy(() => import("@/App"));

export const Route = createFileRoute("/$")({
  ssr: false,
  component: AppHost,
});

function AppHost() {
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <Suspense fallback={<div className="min-h-screen" />}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}
