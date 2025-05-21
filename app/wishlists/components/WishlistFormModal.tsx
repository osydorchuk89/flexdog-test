"use client";

import { useEffect, useRef, useState } from "react";

import { useModalClose } from "@/lib/hooks";
import { Modal } from "@/app/components/ui/Modal";
import { Button } from "@/app/components/ui/Button";
import { addOrRemoveFromWishList, createOrUpdateWishlist } from "@/lib/actions";
import { type Product } from "@/lib/entities";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { modalActions } from "@/store";
import { CloseIconButton } from "@/app/components/ui/CloseIconButton";
import { useRouter } from "next/navigation";

interface WishlistFormModalProps {
    userId: string;
}

export const WishlistFormModal = ({ userId }: WishlistFormModalProps) => {
    const { activeWishlist, previousWishlist } = useAppSelector(
        (state) => state.userWishlists
    );
    const { changeWishlist, wishlistProductId, wishlistFormOpen } =
        useAppSelector((state) => state.modals);

    const [name, setName] = useState(activeWishlist?.name || "");
    const [description, setDescription] = useState(
        activeWishlist?.description || ""
    );
    const [isDefault, setIsDefault] = useState(
        activeWishlist?.isDefault || false
    );
    const [isPublic, setIsPublic] = useState(activeWishlist?.isPublic || false);

    useEffect(() => {
        if (activeWishlist) {
            setName(activeWishlist.name);
            setDescription(activeWishlist.description);
            setIsDefault(activeWishlist.isDefault);
            setIsPublic(activeWishlist.isPublic);
        } else {
            setName("");
            setDescription("");
            setIsDefault(false);
            setIsPublic(false);
        }
    }, [activeWishlist]);

    const [errors, setErrors] = useState<{ error: string; field?: string }[]>();

    const dispatch = useAppDispatch();

    const onModalClose = () => {
        dispatch(modalActions.closeWishlistForm());
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useModalClose(onModalClose, modalRef as React.RefObject<HTMLDivElement>);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if product is moved to another wishlist, delete it from the previous one
        if (changeWishlist && previousWishlist) {
            await addOrRemoveFromWishList(
                wishlistProductId,
                previousWishlist.id
            );
        }

        let products: string[] = [];

        // keep products on a wishlist that is being edited
        if (activeWishlist?.products) {
            products = (activeWishlist.products as Product[]).map(
                (product) => product.id
            );
        }

        // if a new wishlist is created together with moving a product from other wishlist, add a product to the new wishlist
        if (products.length === 0 && wishlistProductId) {
            products.push(wishlistProductId);
        }

        const { wishlist, errorMessage } = await createOrUpdateWishlist({
            id: activeWishlist?.id || "",
            userId: userId,
            name: name.trim(),
            description: description.trim(),
            isDefault: isDefault,
            isPublic: isPublic,
            products: products,
        });
        if (errorMessage) {
            setErrors(errorMessage);
        }
        if (wishlist) {
            setName("");
            setDescription("");
            setIsDefault(false);
            setIsPublic(false);
            dispatch(modalActions.closeWishlistForm());
            process.env.NODE_ENV === "production" && router.refresh();
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setName(newValue);
        if (newValue.length > 0) {
            setErrors((prevErrors) =>
                prevErrors?.filter((error) => error.field !== "name")
            );
        }
    };

    return (
        <Modal isOpen={wishlistFormOpen}>
            <div
                className="relative bg-white py-10 xl:px-10 lg:px-8 sm:px-6 px-4 rounded-xl w-full sm:w-4/5 md:w-2/3 lg:w-2/5"
                ref={modalRef}
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <h2 className="text-2xl text-center font-semibold">
                        {activeWishlist
                            ? "Upravit wishlist"
                            : "Vytvořit nový wishlist"}
                    </h2>
                    <div className="flex flex-col gap-2">
                        <input
                            className="border border-gray-700 rounded-xl px-3 py-2 focus:border-stone-900"
                            type="text"
                            name="name"
                            placeholder="název"
                            value={name}
                            onChange={handleNameChange}
                        />
                        <p className="text-red-700">
                            {
                                errors?.find((error) => error.field === "name")
                                    ?.error
                            }
                        </p>
                    </div>
                    <textarea
                        className="border border-gray-700 rounded-xl px-3 py-2 focus:border-stone-900 resize-none"
                        rows={3}
                        name="description"
                        placeholder="popis (volitelný)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label className="flex gap-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={isDefault}
                            disabled={activeWishlist?.isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                        />
                        Defaultní wishlist
                    </label>
                    <label className="flex gap-2">
                        <input
                            type="checkbox"
                            name="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        Veřejný wishlist
                    </label>
                    <div className="flex justify-center">
                        <Button
                            text={
                                activeWishlist
                                    ? "Upravit wishlist"
                                    : "Vytvořit wishlist"
                            }
                            type="submit"
                        />
                    </div>
                    <CloseIconButton handleClick={onModalClose} />
                </form>
            </div>
        </Modal>
    );
};
