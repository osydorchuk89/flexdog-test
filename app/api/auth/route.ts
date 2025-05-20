import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// logging out user
export async function POST() {
    try {
        (await cookies()).delete("userSession");
        return NextResponse.json({ message: "Logged out" });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}
