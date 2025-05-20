"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Products } from "@/app/components/Products";
import { Button } from "@/app/components/ui/Button";
import { AddIcon } from "@/app/components/ui/icons/AddIcon";
import { BASE_URL, deleteWishList } from "@/lib/actions";
import { type User, type Product, type Wishlist } from "@/lib/entities";
import { DeleteWishlistModal } from "./DeleteWishlistModal";
import { WishlistActionBar } from "./WishlistActionBar";
import { useAppDispatch } from "@/store/hooks";
import { modalActions, userWishlistActions } from "@/store";

interface WishlistProps {
    wishlists: Wishlist[];
    user: User | undefined;
}

export const Wishlists = ({ wishlists, user }: WishlistProps) => {
    const getDefaultWishlist = () => {
        return wishlists.find((wishlist) => wishlist.isDefault === true)!;
    };
    let defaultWishList = getDefaultWishlist();
    const [selectedWishList, setSelectedWishlist] = useState(defaultWishList);

    useEffect(() => {
        const selectedWishListDeleted = !wishlists.some(
            (wishlist) => wishlist.id === selectedWishList.id
        );
        if (selectedWishListDeleted) {
            defaultWishList = getDefaultWishlist();
            setSelectedWishlist(defaultWishList);
        } else {
            const updatedWishlist = wishlists.find(
                (wishlist) => wishlist.id === selectedWishList.id
            )!;
            setSelectedWishlist(updatedWishlist);
        }
    }, [wishlists]);

    const dispatch = useAppDispatch();

    const handleEditWishlist = () => {
        dispatch(modalActions.openWishlistForm());
        dispatch(userWishlistActions.setActiveWishlist(selectedWishList));
    };

    const handleAddWishlist = () => {
        dispatch(modalActions.openWishlistForm());
        dispatch(userWishlistActions.setActiveWishlist(null));
    };

    const router = useRouter();

    const handleDeleteWishlist = async () => {
        if (selectedWishList.products.length > 0) {
            dispatch(modalActions.openDeleteWishlist());
        } else {
            await deleteWishList(selectedWishList.id);
            router.refresh();
        }
    };

    const handleAddProductsToCart = () => {
        dispatch(modalActions.openAddToCart());
        dispatch(userWishlistActions.setActiveWishlist(selectedWishList));
    };

    const pathname = usePathname();

    const handleCopyWishlistUrl = async (wishlistUrl: string) => {
        try {
            await navigator.clipboard.writeText(wishlistUrl);
            dispatch(modalActions.openWishlistUrl());
            dispatch(modalActions.setWishlistId(selectedWishList.id));
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const baseWishlistTitleClass = "font-bold text-lg cursor-pointer py-1";
    const activeWishlistTitleClass =
        baseWishlistTitleClass + " border-b-3 border-stone-500";

    return (
        <div className="flex flex-col gap-10">
            <nav className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-wrap items-end gap-4">
                    <ul className="flex flex-wrap gap-4">
                        {wishlists.map((wishlist) => (
                            <li
                                className="relative pt-4 sm:pt-6"
                                key={wishlist.id}
                                onClick={() => {
                                    setSelectedWishlist(wishlist);
                                    dispatch(
                                        userWishlistActions.setActiveWishlist(
                                            wishlist
                                        )
                                    );
                                }}
                            >
                                <span
                                    className={
                                        wishlist === selectedWishList
                                            ? activeWishlistTitleClass
                                            : baseWishlistTitleClass
                                    }
                                >
                                    {wishlist.name}
                                </span>
                                <span className="absolute top-1 right-0 text-xs text-white px-[5px] rounded-full bg-black">
                                    {wishlist.products.length}
                                </span>
                            </li>
                        ))}
                        <li
                            className="cursor-pointer self-end pb-1"
                            onClick={handleAddWishlist}
                        >
                            <AddIcon />
                        </li>
                    </ul>
                </div>
                {selectedWishList.isPublic && (
                    <Button
                        text="Sdílet odkaz"
                        onClick={() =>
                            handleCopyWishlistUrl(
                                `${BASE_URL}${pathname}/${selectedWishList.id}`
                            )
                        }
                    />
                )}
            </nav>
            <Products
                products={selectedWishList.products as Product[]}
                wishlists={wishlists}
                user={user}
            />
            <WishlistActionBar
                handleEditWishlist={handleEditWishlist}
                handleDeleteWishlist={handleDeleteWishlist}
                handleAddProductsToCart={handleAddProductsToCart}
                areProducts={selectedWishList.products.length > 0}
            />
            <DeleteWishlistModal wishlistId={selectedWishList.id} />
        </div>
    );
};
