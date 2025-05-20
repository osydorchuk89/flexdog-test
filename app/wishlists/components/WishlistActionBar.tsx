import { Button } from "@/app/components/ui/Button";

interface WishlistActionBarProps {
    handleEditWishlist: () => void;
    handleDeleteWishlist: () => void;
    handleAddProductsToCart: () => void;
    areProducts: boolean;
}

export const WishlistActionBar = ({
    handleEditWishlist,
    handleDeleteWishlist,
    handleAddProductsToCart,
    areProducts,
}: WishlistActionBarProps) => {
    return (
        <div className="flex justify-center items-center md:flex-row flex-col gap-6 md:gap-4">
            <Button text="Upravit wishlist" onClick={handleEditWishlist} />
            <Button text="Smazat wishlist" onClick={handleDeleteWishlist} />
            {areProducts && (
                <Button
                    text="Přidat vše do košíku"
                    onClick={handleAddProductsToCart}
                />
            )}
        </div>
    );
};
