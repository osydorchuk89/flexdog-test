"use client";
import { useRef } from "react";

import { Modal } from "@/app/components/ui/Modal";
import { useModalClose } from "@/lib/hooks";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { modalActions } from "@/store";
import { CloseIconButton } from "@/app/components/ui/CloseIconButton";

export const WishlistUrlModal = () => {
    const { wishlistId, wishlistUrlOpen } = useAppSelector(
        (state) => state.modals
    );
    const dispatch = useAppDispatch();

    const onModalClose = () => {
        dispatch(modalActions.closeWishlistUrl());
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useModalClose(onModalClose, modalRef as React.RefObject<HTMLDivElement>);

    const router = useRouter();

    return (
        <Modal isOpen={wishlistUrlOpen}>
            <div
                className="relative flex flex-col gap-10 bg-white rounded-xl py-10 xl:px-10 lg:px-8 sm:px-6 px-4 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3"
                ref={modalRef}
            >
                <h2 className="text-2xl text-center font-semibold">
                    Sdilení wishlistu
                </h2>
                <p className="text-center">Odkaz na wishlist je zkopírován!</p>
                <div className="flex justify-center">
                    <Button
                        text="Přejít na stránku wishlistu"
                        onClick={() => {
                            dispatch(modalActions.closeWishlistUrl());
                            router.push(`/wishlists/${wishlistId}`);
                        }}
                    />
                </div>
                <CloseIconButton handleClick={onModalClose} />
            </div>
        </Modal>
    );
};
