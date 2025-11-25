import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function StartupGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(5);
  const [error, setError] = useState(false);

  async function wakeBackend() {
    setError(false);
    setProgress(5);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
        setError(true);
      }, 25000); // 25s timeout before showing retry

      // Progress animation (purely visual)
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 8, 95));
      }, 500);

      await fetch(import.meta.env.VITE_API_BASE_URL + "/health", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeout);
      clearInterval(interval);

      setProgress(100);
      setTimeout(() => setReady(true), 400); // little delay for animation
    } catch (err) {
      console.error("Failed to wake backend:", err);
      setError(true);
    }
  }

  useEffect(() => {
    wakeBackend();
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-8 px-4">
        {/* Animated Skeleton Placeholder */}
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <Skeleton className="h-10 w-48 animate-pulse" />
          <Skeleton className="h-6 w-64 animate-pulse" />
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <Progress value={progress} className="h-3" />
        </div>

        {/* Status Text */}
        {!error ? (
          <div className="text-center">
            <p className="text-lg font-medium">
              Warming up the backend server…
            </p>
            <p className="mt-1 text-sm opacity-70">
              This may take 50 seconds or <u>more</u> on Render free tier.
            </p>
            <p className="mt-2 text-xs opacity-60">
              (The server sleeps when idle — loading on-demand)
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-lg font-medium text-red-500">
              The backend is taking longer than expected.
            </p>
            <p className="text-sm opacity-70">
              It might still be waking up — try again.
            </p>

            {/* Retry Button */}
            <Button onClick={wakeBackend} variant="default">
              Try Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
