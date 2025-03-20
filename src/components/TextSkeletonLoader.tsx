export function TextSkeletonLoader() {
    return (
        <div className="relative flex flex-grow flex-col gap-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
            <div className="h-4 w-7/12 animate-pulse rounded bg-gray-700" />
        </div>
    );
}
