"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { type Product, type User, type Wishlist } from "../../lib/entities";
import { HeartIcon } from "./ui/icons/HeartIcon";
import { addOrRemoveFromWishList } from "../../lib/actions";
import { ExchangeIcon } from "./ui/icons/ExchangeIcon";
import { useAppDispatch } from "@/store/hooks";
import { modalActions } from "@/store";

interface ProductCardProps {
    product: Product;
    wishlists: Wishlist[];
    user: User | undefined;
}

export const ProductCard = ({ product, wishlists, user }: ProductCardProps) => {
    const productOnWishlist =
        wishlists.length === 0
            ? false
            : wishlists?.some((wishlist) =>
                  (wishlist.products as Product[]).some(
                      (item) => item.id === product.id
                  )
              );

    const [onWishList, setOnWishList] = useState(productOnWishlist);

    useEffect(() => {
        if (wishlists.length === 0) {
            setOnWishList(false);
            return;
        }
        const productOnWishlist = wishlists.some((wishlist) =>
            (wishlist.products as Product[]).some(
                (item) => item.id === product.id
            )
        );
        setOnWishList(productOnWishlist);
    }, [wishlists, product.id]);

    const dispatch = useAppDispatch();

    const handleClickWishlist = async () => {
        if (!user) {
            dispatch(modalActions.openRedirectToLogin());
            return;
        }
        if (onWishList) {
            const wishlist = wishlists.find((wishlist) =>
                (wishlist.products as Product[]).find(
                    (item) => item.id === product.id
                )
            );
            if (wishlist) {
                await addOrRemoveFromWishList(product.id, wishlist.id);
            }
        } else {
            dispatch(modalActions.openAddToWishlistForm());
            dispatch(modalActions.setWishlistProductId(product.id));
        }
    };

    const handleChangeWishlist = () => {
        dispatch(modalActions.openAddToWishlistForm());
        dispatch(modalActions.setWishlistProductId(product.id));
    };

    const baseHeartIconClass =
        "bg-white p-1 rounded-full absolute top-4 right-4 hover:bg-rose-300 cursor-pointer";
    const activeHeartIconClass =
        "bg-rose-300 p-1 rounded-full absolute top-4 right-4 hover:bg-white cursor-pointer";

    return (
        <div className="flex flex-col rounded-2xl border-1 border-stone-200 hover:shadow-xl overflow-hidden w-[350px]">
            <div className="relative">
                <Image
                    src={product.image_url}
                    width={350}
                    height={280}
                    alt="Obraz tenisek"
                    priority
                />
                <div
                    className={
                        onWishList ? activeHeartIconClass : baseHeartIconClass
                    }
                    onClick={handleClickWishlist}
                >
                    <HeartIcon />
                </div>
                {onWishList && (
                    <div
                        className="absolute top-14 right-4 bg-white p-1 rounded-full hover:bg-emerald-300 cursor-pointer"
                        onClick={handleChangeWishlist}
                    >
                        <ExchangeIcon />
                    </div>
                )}
            </div>
            <article className="flex flex-col p-4 gap-4">
                <div>
                    <p className="font-bold">{product.brand}</p>
                    <p>{product.model}</p>
                </div>
                <div
                    className={
                        product.available ? "text-black" : "text-stone-500"
                    }
                >
                    <p>{product.price} Kč</p>
                    <p>{product.available ? "Dostupné" : "Vyprodáno"}</p>
                </div>
            </article>
        </div>
    );
};
