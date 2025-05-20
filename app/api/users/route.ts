import { fetchUsers } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// checking the login data sent by user and creating a session, if it is valid
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const users = await fetchUsers();
        const user = users.find(
            (user) => user.email === email && user.password === password
        );

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create a response
        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

        response.cookies.set(
            "userSession",
            JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
            }),
            {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24,
                path: "/",
            }
        );

        return response;
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
