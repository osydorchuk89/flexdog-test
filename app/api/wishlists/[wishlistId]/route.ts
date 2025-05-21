import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { fetchWishlists, getProductsMap } from "@/lib/utils";

const wishlistsFilePath = path.join(process.cwd(), "data", "wishlists.json");

// get a wishlist
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ wishlistId: string }> }
) {
    try {
        const { wishlistId } = await params;
        const wishlists = await fetchWishlists();

        const wishlist = wishlists.find(
            (wishlist) => wishlist.id === wishlistId
        );

        if (!wishlist) {
            return NextResponse.json(
                { error: "Wishlist not found" },
                { status: 404 }
            );
        }

        const productMap = await getProductsMap();

        const wishlistProducts = wishlist.products.map(
            (productId) => productMap.get(productId as string) || null
        );

        return NextResponse.json({ ...wishlist, products: wishlistProducts });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to fetch the wishlist data" },
            { status: 500 }
        );
    }
}

// add/remove product to/from a wishlist
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ wishlistId: string }> }
) {
    try {
        const { productId, changeWishlist } = await req.json();
        const { wishlistId } = await params;

        let wishlists = await fetchWishlists();

        // if a user wants to move a product to another wishlist, find the current wishlist
        if (changeWishlist) {
            const currentWishlist = wishlists.find((wishlist) =>
                wishlist.products.includes(productId)
            );
            if (currentWishlist) {
                // and remove the product from the current wishlist
                currentWishlist.products = (
                    currentWishlist.products as string[]
                ).filter((id) => id !== productId);
            }
        }

        // Create a new wishlists array with the updated wishlist
        const updatedWishlists = wishlists.map((wishlist) =>
            wishlist.id === wishlistId
                ? {
                      ...wishlist,
                      products: wishlist.products.includes(productId)
                          ? wishlist.products.filter((id) => id !== productId) // Remove product
                          : [...wishlist.products, productId], // Add product
                  }
                : wishlist
        );

        await fs.writeFile(
            wishlistsFilePath,
            JSON.stringify(updatedWishlists, null, 4),
            "utf-8"
        );

        revalidateTag("userWishlists");
        revalidateTag("userWishlist");

        return NextResponse.json({ message: "Wishlist succesfully updated" });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to add the product to the wishlist" },
            { status: 500 }
        );
    }
}

// delete a wishlist
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ wishlistId: string }> }
) {
    try {
        const { wishlistId } = await params;
        const wishlists = await fetchWishlists();

        const wishlistToDelete = wishlists.find(
            (wishlist) => wishlist.id === wishlistId
        );

        if (!wishlistToDelete) {
            return NextResponse.json(
                { error: "Wishlist not found" },
                { status: 404 }
            );
        }

        let updatedWishlists = wishlists.filter(
            (wishlist) => wishlist.id !== wishlistId
        );

        // if the deleted wishlist was default, set the first remaining wishlist as the default
        if (wishlistToDelete.isDefault) {
            const userWishlists = updatedWishlists.filter(
                (wishlist) => wishlist.userId === wishlistToDelete.userId
            );

            if (userWishlists.length > 0) {
                updatedWishlists = updatedWishlists.map((wishlist) =>
                    wishlist.id === userWishlists[0].id
                        ? { ...wishlist, isDefault: true }
                        : wishlist
                );
            }
        }

        await fs.writeFile(
            wishlistsFilePath,
            JSON.stringify(updatedWishlists, null, 4),
            "utf-8"
        );

        revalidateTag("userWishlists");
        revalidateTag("userWishlist");

        return NextResponse.json({ message: "Wishlist successfully deleted" });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to delete the wishlist" },
            { status: 500 }
        );
    }
}
