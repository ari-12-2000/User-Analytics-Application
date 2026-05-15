"use client";

export default function PageUrlSelect({
  pageUrls,
  value,
  onChange,
  disabled,
}: {
  pageUrls: string[];
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  if (pageUrls.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Page URL
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste exact page URL (must match tracked URL)"
          disabled={disabled}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <p className="text-xs text-zinc-500">
          No pages with clicks yet. Enter the exact URL from your tracker events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="page-url-select"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Page URL
      </label>
      <select
        id="page-url-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <option value="">Select a page…</option>
        {pageUrls.map((url) => (
          <option key={url} value={url}>
            {url}
          </option>
        ))}
      </select>
    </div>
  );
}
