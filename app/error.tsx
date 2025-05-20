"use client";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col gap-10 items-center justify-center min-h-[75vh]">
            <h2 className="text-xl">Něco se pokazilo</h2>
            <Link className="underline" href="/">
                Zpět na hlavní stránku
            </Link>
        </div>
    );
}
