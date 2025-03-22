import { NavBar } from "@/components/blocks/NavBar";

export default function UpgradePage() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <NavBar />

            <p className="mx-auto max-w-lg text-center text-xl text-white">
                Unfortunately premium is not available yet. If you ask me nicely
                I might enable it on your account :)
            </p>
        </div>
    );
}
