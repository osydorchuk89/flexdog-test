"use client";
import { useRef } from "react";

import { Button } from "@/app/components/ui/Button";
import { Modal } from "@/app/components/ui/Modal";
import { deleteWishList } from "@/lib/actions";
import { useModalClose } from "@/lib/hooks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { modalActions } from "@/store";
import { CloseIconButton } from "@/app/components/ui/CloseIconButton";
import { usePathname, useRouter } from "next/navigation";

interface DeleteWishListProps {
    wishlistId: string;
}

export const DeleteWishlistModal = ({ wishlistId }: DeleteWishListProps) => {
    const path = usePathname();
    const { deleteWishlistOpen } = useAppSelector((state) => state.modals);
    const dispatch = useAppDispatch();

    const onModalClose = () => {
        dispatch(modalActions.closeDeleteWishlist());
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useModalClose(onModalClose, modalRef as React.RefObject<HTMLDivElement>);

    const router = useRouter();

    const handleDeleteWishlist = async () => {
        await deleteWishList(wishlistId);
        onModalClose();
        path.includes("/wishlists/")
            ? router.replace("/wishlists")
            : router.refresh();
    };
    return (
        <Modal isOpen={deleteWishlistOpen}>
            <div
                className="relative flex flex-col gap-10 bg-white rounded-xl py-10 xl:px-10 lg:px-8 sm:px-6 px-4 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3"
                ref={modalRef}
            >
                <h2 className="text-2xl text-center font-semibold">
                    Mazání wishlistu
                </h2>
                <p className="text-center">
                    Wishlist obsahuje produkty. Opravdu chcete ho smazat?
                </p>
                <div className="flex justify-center">
                    <Button
                        text="Smazat wishlist"
                        onClick={handleDeleteWishlist}
                    />
                </div>
                <CloseIconButton handleClick={onModalClose} />
            </div>
        </Modal>
    );
};
