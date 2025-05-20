"use client";
import { useRef } from "react";

import { Button } from "@/app/components/ui/Button";
import { Modal } from "@/app/components/ui/Modal";
import { addOrRemoveFromCart, addOrRemoveFromWishList } from "@/lib/actions";
import { type Product } from "@/lib/entities";
import { useModalClose } from "@/lib/hooks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { modalActions, userWishlistActions } from "@/store";
import { CloseIconButton } from "@/app/components/ui/CloseIconButton";

export const AddToCartModal = () => {
    const { addToCartOpen } = useAppSelector((state) => state.modals);
    const { activeWishlist } = useAppSelector((state) => state.userWishlists);

    const dispatch = useAppDispatch();

    const onModalClose = () => {
        dispatch(modalActions.closeAddToCart());
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useModalClose(onModalClose, modalRef as React.RefObject<HTMLDivElement>);

    const handleCartUpdate = async (removeFromWishlist: boolean) => {
        if (activeWishlist) {
            for (const product of activeWishlist.products as Product[]) {
                await addOrRemoveFromCart(activeWishlist.userId, product.id);
                if (removeFromWishlist) {
                    await addOrRemoveFromWishList(
                        product.id,
                        activeWishlist.id
                    );
                }
            }
            dispatch(userWishlistActions.setActiveWishlist(null));
            dispatch(modalActions.closeAddToCart());
        }
    };

    return (
        <Modal isOpen={addToCartOpen}>
            <div
                className="relative flex flex-col gap-10 rounded-xl bg-white py-10 xl:px-10 lg:px-8 sm:px-6 px-4 w-full sm:w-5/6 md:w-2/3 lg:w-3/5 xl:w-1/2 2xl:w-2/5"
                ref={modalRef}
            >
                <h2 className="text-2xl text-center font-semibold">
                    Přidaní do košíku
                </h2>
                <p className="text-center">
                    Chcete odstranit produkty z wishlistu po jejich přidání do
                    nákupního košíku?
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-4">
                    <Button
                        text="Odstranit z wishlistu"
                        onClick={() => handleCartUpdate(true)}
                    />
                    <Button
                        text="Ponechat ve wishlistu"
                        onClick={() => handleCartUpdate(false)}
                    />
                </div>
                <CloseIconButton handleClick={onModalClose} />
            </div>
        </Modal>
    );
};
