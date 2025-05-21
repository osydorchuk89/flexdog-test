import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// logging out user
export async function POST() {
    try {
        (await cookies()).delete("userSession");
        revalidatePath("/", "layout");
        return NextResponse.json({ message: "Logged out" });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}
