import { NextRequest, NextResponse } from "next/server";

import { fetchProducts } from "@/lib/utils";

// getting data about specific product
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const products = await fetchProducts();

        const product = products.find((product) => product.id === productId);

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}
