"use client";
import { useRef } from "react";

import { modalActions } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useModalClose } from "@/lib/hooks";
import { Modal } from "./ui/Modal";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { CloseIconButton } from "./ui/CloseIconButton";

export const RedirectToLoginModal = () => {
    const { redirectToLoginOpen } = useAppSelector((state) => state.modals);
    const dispatch = useAppDispatch();
    const onModalClose = () => dispatch(modalActions.closeRedirectToLogin());

    const modalRef = useRef<HTMLDivElement>(null);
    useModalClose(onModalClose, modalRef as React.RefObject<HTMLDivElement>);

    const router = useRouter();
    return (
        <Modal isOpen={redirectToLoginOpen}>
            <div
                className="relative bg-white p-10 rounded-xl w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 2xl:w-1/3 flex flex-col gap-6 items-center"
                ref={modalRef}
            >
                <h2 className="text-center text-2xl font-bold">
                    Už tam skoro jste
                </h2>
                <p className="text-center">
                    Chcete-li přidat produkt do seznamu přání, musíte se poprve
                    přihlásit.
                </p>
                <div className="flex items-center">
                    <Button
                        text="Na přihlašovací stránku"
                        onClick={() => {
                            onModalClose();
                            router.push("/login");
                        }}
                    />
                </div>
                <CloseIconButton handleClick={onModalClose} />
            </div>
        </Modal>
    );
};
