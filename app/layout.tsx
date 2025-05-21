import type { Metadata } from "next";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

import { Providers } from "./StoreProviders";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import "./globals.css";
import { User } from "../lib/entities";
import { getUserCart } from "../lib/actions";

export const metadata: Metadata = {
    title: "Flexdog App",
    description: "A dummy Flexdog application",
};

const getCachedUserCart = unstable_cache(
    async (userId: string) => getUserCart(userId),
    ["user-cart"],
    { tags: ["userCart"] }
);

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const session = cookieStore.get("userSession");

    const user: User | undefined = session
        ? JSON.parse(session.value)
        : undefined;

    const userCart = (user && (await getCachedUserCart(user.id))) || undefined;

    return (
        <Providers>
            <html lang="en">
                <body>
                    <Header user={user} userCart={userCart} />
                    {children}
                    <Footer />
                </body>
            </html>
        </Providers>
    );
}
