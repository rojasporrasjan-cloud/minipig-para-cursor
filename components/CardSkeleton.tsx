// components/CardSkeleton.tsx
export default function CardSkeleton() {
  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 space-y-4">
      <div className="aspect-[4/3] w-full rounded-lg bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-1/4 rounded bg-gray-200 animate-pulse" />
        <div className="h-8 w-1/3 rounded-md bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}