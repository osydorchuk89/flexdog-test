import { NextResponse } from "next/server";

import { fetchProducts } from "@/lib/utils";

// get all products data
export async function GET() {
    try {
        const products = await fetchProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product data" },
            { status: 500 }
        );
    }
}
