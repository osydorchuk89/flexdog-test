"use client";

import { WishlistActionBar } from "./WishlistActionBar";
import { deleteWishList } from "@/lib/actions";
import { type Product, type User, type Wishlist } from "@/lib/entities";
import { Products } from "@/app/components/Products";
import { useAppDispatch } from "@/store/hooks";
import { modalActions, userWishlistActions } from "@/store";
import { useRouter } from "next/navigation";

interface WishlistContentProps {
    user: User | undefined;
    wishlist: Wishlist;
    wishlists: Wishlist[];
}

export const WishlistContent = ({
    user,
    wishlists,
    wishlist,
}: WishlistContentProps) => {
    const dispatch = useAppDispatch();

    const handleEditWishlist = () => {
        dispatch(modalActions.openWishlistForm());
        dispatch(userWishlistActions.setActiveWishlist(wishlist));
    };

    const router = useRouter();

    const handleDeleteWishlist = async () => {
        if (wishlist.products.length > 0) {
            dispatch(modalActions.openDeleteWishlist());
        } else {
            await deleteWishList(wishlist.id);
            router.replace("/wishlists");
        }
    };

    const handleAddProductsToCart = () => {
        dispatch(modalActions.openAddToCart());
        dispatch(userWishlistActions.setActiveWishlist(wishlist));
    };
    return (
        <>
            <h2 className="text-2xl font-bold text-center">{wishlist.name}</h2>
            <Products
                products={wishlist.products as Product[]}
                wishlists={wishlists}
                user={user}
            />
            {user && user.id === wishlist.userId && (
                <WishlistActionBar
                    handleEditWishlist={handleEditWishlist}
                    handleDeleteWishlist={handleDeleteWishlist}
                    handleAddProductsToCart={handleAddProductsToCart}
                    areProducts={wishlist.products.length > 0}
                />
            )}
        </>
    );
};
