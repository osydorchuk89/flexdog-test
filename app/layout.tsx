import type { Metadata } from "next";
import { cookies } from "next/headers";

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const session = cookieStore.get("userSession");

    const user: User | undefined = session ? JSON.parse(session.value) : undefined;
    const userCart = (user && (await getUserCart(user.id))) || undefined;

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
