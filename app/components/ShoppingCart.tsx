import { useRouter } from "next/navigation";
import { addOrRemoveFromCart, clearCart } from "../../lib/actions";
import { type Cart, type Product } from "../../lib/entities";
import { Button } from "./ui/Button";
import { CloseIcon } from "./ui/icons/CloseIcon";
import { MinusIcon } from "./ui/icons/MinusIcon";
import { PlusIcon } from "./ui/icons/PlusIcon";

interface ShoppingCartProps {
    userCart: Cart;
    handleClose: () => void;
}

export const ShoppingCart = ({ userCart, handleClose }: ShoppingCartProps) => {
    const router = useRouter();

    const handleAddProduct = async (productId: string) => {
        await addOrRemoveFromCart(userCart.userId, productId);
        process.env.NODE_ENV === "production" && router.refresh();
    };

    const handleRemoveProduct = async (productId: string) => {
        await addOrRemoveFromCart(userCart.userId, productId, true);
        process.env.NODE_ENV === "production" && router.refresh();
    };

    const handleRemoveAllProducts = async () => {
        await clearCart(userCart.userId);
        process.env.NODE_ENV === "production" && router.refresh();
    };

    return (
        <div className="relative flex flex-col gap-10 rounded-xl shadow-xl bg-white py-10 px-4 max-[400px]:w-[95vw] w-96">
            <h2 className="font-bold text-lg text-center">Nákupní košík</h2>
            {userCart.products.length > 0 ? (
                <ul className="flex flex-col gap-4">
                    <li className="flex justify-between font-semibold">
                        <span>Model</span>
                        <span>Počet</span>
                    </li>
                    {userCart.products.map((product) => {
                        const productData = product.id as Product;
                        return (
                            <li
                                key={productData.id}
                                className="flex justify-between"
                            >
                                <span>
                                    {productData.brand} {productData.model}
                                </span>
                                <div className="flex gap-1">
                                    <div
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleRemoveProduct(productData.id)
                                        }
                                    >
                                        <MinusIcon />
                                    </div>
                                    <span>{product.quantity}</span>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleAddProduct(productData.id)
                                        }
                                    >
                                        <PlusIcon />
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-center">Nákupní košík je prázdný</p>
            )}
            {userCart.products.length > 0 && (
                <div className="flex justify-center">
                    <Button
                        text="Odstranit vše"
                        onClick={handleRemoveAllProducts}
                    />
                </div>
            )}
            <div
                className="absolute top-5 right-5 cursor-pointer"
                onClick={handleClose}
            >
                <CloseIcon />
            </div>
        </div>
    );
};
