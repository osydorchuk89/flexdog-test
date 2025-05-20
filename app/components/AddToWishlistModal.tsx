"use client";
import { useEffect, useRef, useState } from "react";

import { useModalClose } from "@/lib/hooks";
import { Modal } from "@/app/components/ui/Modal";
import { Button } from "./ui/Button";
import { addOrRemoveFromWishList } from "../../lib/actions";
import { type Product, type User, type Wishlist } from "../../lib/entities";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { modalActions, userWishlistActions } from "@/store";
import { CloseIconButton } from "./ui/CloseIconButton";

interface AddToWishlistModalProps {
    wishlists: Wishlist[];
}

export const AddToWishlistModal = ({
    wishlists,
}: AddToWishlistModalProps) => {
    const { wishlistProductId, addToWishlistFormOpen } = useAppSelector(
        (state) => state.modals
    );
    const { activeWishlist } = useAppSelector((state) => state.userWishlists);

    let productWishlist =
        activeWishlist ||
        wishlists.find((wishlist) =>
            (wishlist.products as Product[]).find(
                (product) => product.id === wishlistProductId
            )
        );
    const productOnWishlist = productWishlist !== undefined;

    const defaultWishList = wishlists.find(
        (wishlist) => wishlist.isDefault === true
    )!;

    const [selectedWishListId, setSelectedWishlistId] = useState(
        productWishlist?.id || defaultWishList.id
    );

    useEffect(() => {
        productWishlist =
            activeWishlist ||
            wishlists.find((wishlist) =>
                (wishlist.products as Product[]).find(
                    (product) => product.id === wishlistProductId
                )
            );
        productWishlist && setSelectedWishlistId(productWishlist.id);
    }, [addToWishlistFormOpen]);

    const dispatch = useAppDispatch();
    const onModalClose = () => dispatch(modalActions.closeAddToWishListForm());

    const modalRef = useRef<HTMLDivElement>(null);
    useModalClose(onModalClose, modalRef as React.RefObject<HTMLDivElement>);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // before changing wishlists, check if the product is on other wishlist
        const otherWishlist = wishlists.find(
            (wishlist) => wishlist.id === selectedWishListId
        );
        const productOnOtherWishlist = (
            otherWishlist?.products as Product[]
        ).some((product) => product.id === wishlistProductId);

        if (productOnOtherWishlist) {
            alert(
                "Produkt nelze přesunout na jiný wishlist, protože se na něm již nachází."
            );
            return;
        }

        await addOrRemoveFromWishList(
            wishlistProductId,
            selectedWishListId,
            productOnWishlist // check if the product should be moved to other wishlist
        );
        dispatch(modalActions.closeAddToWishListForm());
    };

    const handleCreateWishlist = () => {
        onModalClose();
        dispatch(modalActions.openWishlistForm());
        if (productOnWishlist) {
            dispatch(modalActions.setChangeWishlist(true));
            dispatch(userWishlistActions.setPreviousWishList(productWishlist));
        }
    };

    return (
        <Modal isOpen={addToWishlistFormOpen}>
            <div
                className="relative bg-white p-10 rounded-xl w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 2xl:w-1/3"
                ref={modalRef}
            >
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <h2 className="text-2xl text-center font-semibold">
                        {productOnWishlist
                            ? "Změnit wishlist"
                            : "Přidat produkt do wishlistu"}
                    </h2>
                    <p className="text-center text-lg font-semibold">
                        Vyberte prosím wishlist
                    </p>
                    <ul className="flex flex-col gap-2">
                        {wishlists.map((wishlist) => {
                            return (
                                <li key={wishlist.id}>
                                    <label className="block mb-2">
                                        <input
                                            type="radio"
                                            name="wishlistId"
                                            value={wishlist.id}
                                            checked={
                                                selectedWishListId ===
                                                wishlist.id
                                            }
                                            onChange={(e) =>
                                                setSelectedWishlistId(
                                                    e.target.value
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        {wishlist.name}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-4">
                        <Button
                            text={productOnWishlist ? "Změnit" : "Přidat"}
                            type="submit"
                        />
                        <Button
                            text="Přidat do nového wishlistu"
                            type="button"
                            onClick={handleCreateWishlist}
                        />
                    </div>
                </form>
                <CloseIconButton handleClick={onModalClose} />
            </div>
        </Modal>
    );
};
