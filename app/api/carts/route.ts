import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { type Product } from "@/lib/entities";
import { fetchCarts, getProductsMap } from "@/lib/utils";

const cartsFilePath = path.join(process.cwd(), "data", "carts.json");

// get user's shopping cart
export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        const carts = await fetchCarts();
        const userCart = carts.find((cart) => cart.userId === userId);

        if (!userCart) {
            return NextResponse.json(
                { error: "Shopping cart not found" },
                { status: 404 }
            );
        }

        const productMap = await getProductsMap();

        const cartProducts = userCart.products.map((product) => ({
            ...product,
            id: productMap.get(product.id as string) || null,
        }));

        return NextResponse.json({ ...userCart, products: cartProducts });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to fetch shopping cart" },
            { status: 500 }
        );
    }
}

// add or remove a product to or from a shopping cart
export async function PUT(req: NextRequest) {
    try {
        const { productId, remove } = await req.json();
        const userId = req.nextUrl.searchParams.get("userId");

        let carts = await fetchCarts();

        const cart = carts.find((cart) => cart.userId === userId);
        if (!cart) {
            return NextResponse.json(
                { error: "Cart not found for user" },
                { status: 404 }
            );
        }

        let updatedProducts: { id: string | Product; quantity: number }[];

        const product = cart.products.find(
            (product) => product.id === productId
        );

        if (remove) {
            if (!product) {
                return NextResponse.json(
                    { error: "Product not found in cart" },
                    { status: 404 }
                );
            }
            // remove product or decrease its quantity
            updatedProducts =
                product.quantity > 1
                    ? cart.products.map((product) =>
                          product.id === productId
                              ? { ...product, quantity: product.quantity - 1 }
                              : product
                      )
                    : cart.products.filter(
                          (product) => product.id !== productId
                      ); // remove if quantity reaches 0
        } else {
            // add product or increase its quantity
            updatedProducts = product
                ? cart.products.map((product) =>
                      product.id === productId
                          ? { ...product, quantity: product.quantity + 1 }
                          : product
                  )
                : [...cart.products, { id: productId, quantity: 1 }];
        }

        const updatedCarts = carts.map((cart) =>
            cart.userId === userId
                ? { ...cart, products: updatedProducts }
                : cart
        );

        await fs.writeFile(
            cartsFilePath,
            JSON.stringify(updatedCarts, null, 4),
            "utf-8"
        );

        revalidateTag("userCart");

        return NextResponse.json({
            message: "Shopping cart updated succesfully",
        });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to add product to shopping cart" },
            { status: 500 }
        );
    }
}

// delete all products from a cart
export async function DELETE(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        const carts = await fetchCarts();

        const updatedCarts = carts.map((cart) =>
            cart.userId === userId ? { ...cart, products: [] } : cart
        );

        await fs.writeFile(
            cartsFilePath,
            JSON.stringify(updatedCarts, null, 4),
            "utf-8"
        );

        revalidateTag("userCart");

        return NextResponse.json({
            message: "All products succesfully deleted form the shopping cart",
        });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to delete all products from the shopping cart" },
            { status: 500 }
        );
    }
}
