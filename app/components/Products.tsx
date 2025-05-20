"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { ProductCard } from "./ProductCard";
import { type Wishlist, type Product, type User } from "../../lib/entities";
import { Button } from "./ui/Button";

interface ProductsProps {
    products: Product[];
    wishlists: Wishlist[];
    user: User | undefined;
}

export const Products = ({ products, wishlists, user }: ProductsProps) => {
    const searchParams = useSearchParams();
    const filterParam = searchParams.get("for");

    if (filterParam) {
        products = products.filter((product) => product.for === filterParam);
    }

    const router = useRouter();

    return (
        <>
            {products.length > 0 ? (
                <ul className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                    {products.map((product: Product) => (
                        <li key={product.id} className="flex justify-center">
                            <ProductCard
                                product={product}
                                wishlists={wishlists}
                                user={user}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="min-h-[40vh] flex flex-col gap-10 justify-center items-center">
                    <p>Tady nejsou žádné produkty.</p>
                    <Button
                        text="Zobrazit produkty"
                        onClick={() => router.push("/")}
                    />
                </div>
            )}
        </>
    );
};
