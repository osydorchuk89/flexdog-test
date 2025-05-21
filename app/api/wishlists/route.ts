import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { type Wishlist } from "@/lib/entities";
import { fetchWishlists, getProductsMap } from "@/lib/utils";

const wishlistsFilePath = path.join(process.cwd(), "data", "wishlists.json");

// get all user's wishlists
export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        const wishlists = await fetchWishlists();
        const productMap = await getProductsMap();

        const userWishlists = wishlists
            .filter((wishlist) => wishlist.userId === userId)
            .map((wishlist) => ({
                ...wishlist,
                products: wishlist.products.map(
                    (productId) => productMap.get(productId as string) || null
                ),
            }));

        return NextResponse.json(userWishlists);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch wishlist data" },
            { status: 500 }
        );
    }
}

// add or edit a wishlist
export async function POST(req: NextRequest) {
    try {
        let {
            userId,
            name,
            description,
            isDefault,
            isPublic,
            products,
            id: wishlistId,
        } = await req.json();

        const validationErrors = [];

        if (name.trim() === "") {
            validationErrors.push({
                error: "Wishlist musí mít název",
                field: "name",
            });
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { errors: validationErrors },
                { status: 400 }
            );
        }

        let wishlists = await fetchWishlists();

        // prevent user from making an existing default wishlist non-default
        const currentWishlist = wishlists.find(
            (wishlist) => wishlist.id === wishlistId
        );
        if (currentWishlist) {
            if (currentWishlist.isDefault && isDefault === false) {
                isDefault = true;
            }
        }

        const newWishlist: Wishlist = {
            id: wishlistId || uuidv4(),
            userId,
            name,
            description,
            isDefault,
            isPublic,
            products,
        };

        // if a new wishlist is marked as default, find the previous default one and mark it as non-default
        if (newWishlist.isDefault) {
            wishlists = wishlists.map((wishlist) =>
                wishlist.isDefault
                    ? { ...wishlist, isDefault: false }
                    : wishlist
            );
        }

        let updatedWishLists: Wishlist[];
        if (!wishlistId) {
            // if this is the first user wishlist, set it as default
            const userWishlists = wishlists.filter(
                (wishlist) => wishlist.userId === userId
            );
            if (userWishlists.length === 0) {
                newWishlist.isDefault = true;
            }

            // create a new wishlist
            updatedWishLists = [...wishlists, newWishlist];
        } else {
            // edit an existing wishlist
            const wishlistIndex = wishlists.findIndex(
                (wishlist) => wishlist.id === wishlistId
            );
            updatedWishLists = [...wishlists];
            updatedWishLists[wishlistIndex] = newWishlist;
        }

        await fs.writeFile(
            wishlistsFilePath,
            JSON.stringify(updatedWishLists, null, 4),
            "utf-8"
        );

        revalidateTag("userWishlists");

        return NextResponse.json({
            message: wishlistId
                ? "Wishlist updated succesfully"
                : "Wishlist succesfully created",
        });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Failed to create wishlist" },
            { status: 500 }
        );
    }
}
