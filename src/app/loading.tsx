import { Loader } from "@/components/Loader";

export default function RootLoading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader className="h-8 w-8 text-gray-500" />
        </div>
    );
}
