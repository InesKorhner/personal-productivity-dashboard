import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
}

export function ErrorMessage({
  message,
  onRetry,
  onDismiss,
  retryLabel = 'Retry',
}: ErrorMessageProps) {
  return (
    <div className="border-destructive/50 bg-destructive/10 flex flex-col gap-3 rounded-lg border p-4 animate-in fade-in-0 slide-in-from-top-2 duration-200 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <AlertCircle className="text-destructive size-5 shrink-0" />
        <p className="text-destructive text-sm font-semibold break-words">
          {message}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="size-4" />
            <span className="hidden sm:inline">{retryLabel}</span>
          </Button>
        )}
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

