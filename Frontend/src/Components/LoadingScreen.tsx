
import { Loader2 } from "lucide-react";

/**
 * LoadingScreen: A full-page loading indicator.
 *
 * This component provides a consistent loading experience across the application,
 * matching the standard page background gradient and displaying a spinning loader.
 */
export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );
};
