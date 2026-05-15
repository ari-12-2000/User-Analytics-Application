export default function LoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-zinc-500 dark:text-zinc-400">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
      {message}
    </div>
  );
}
