"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/ui/Button";
import { sendLoginData } from "@/lib/actions";

export const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setPending(true);
        const loginData = new FormData(event.currentTarget);
        const { user, errorMessage } = await sendLoginData(loginData);
        if (errorMessage) {
            setPending(false);
            setError(errorMessage);
            return;
        }
        if (user) {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <>
            {error && (
                <p className="absolute py-5 text-red-700 top-32">{error}</p>
            )}
            <form
                className="flex flex-col justify-start md:w-[26rem] bg-stone-50 shadow-lg px-10 py-14 rounded-xl gap-10"
                noValidate
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-center">
                    Přihlášení k účtu
                </h2>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email:</label>
                    <input
                        className="border border-gray-700 rounded-xl px-3 py-2 focus:border-stone-900"
                        type="email"
                        name="email"
                        placeholder="email"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Heslo:</label>
                    <input
                        className="border border-gray-700 rounded-xl px-3 py-2 focus:border-stone-900"
                        type="password"
                        name="password"
                        placeholder="heslo"
                    />
                </div>
                <div className="flex justify-center">
                    <Button
                        text={pending ? "POČKEJTE PROSÍM" : "PŘIHLÁSIT SE"}
                        disabled={pending}
                    />
                </div>
            </form>
        </>
    );
};
