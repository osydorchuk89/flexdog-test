import { cookies } from "next/headers";

import { LoginForm } from "./components/LoginForm";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("userSession");

    if (session) {
        redirect("/");
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center h-full py-14 text-sky-950">
            <LoginForm />
        </div>
    );
}
