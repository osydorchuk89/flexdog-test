"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Chip } from "../ui/Chip";
import { UserIcon } from "../ui/icons/UserIcon";
import { LogoutIcon } from "../ui/icons/LogoutIcon";
import { IconButton } from "../ui/IconButton";
import { HeartIcon } from "../ui/icons/HeartIcon";
import { logout } from "@/lib/actions";
import { CartIcon } from "../ui/icons/CartIcon";
import { ShoppingCart } from "../ShoppingCart";
import { type Cart, type User } from "@/lib/entities";
import { useAppDispatch } from "@/store/hooks";
import { userWishlistActions } from "@/store";

interface HeaderProps {
    user: User | undefined;
    userCart: Cart | undefined;
}

const genderFilterItems = [
    { text: "Muži", for: "men" },
    { text: "Ženy", for: "women" },
    { text: "Děti", for: "children" },
];

export const Header = ({ user, userCart }: HeaderProps) => {
    const searchParams = useSearchParams();
    const filterParam = searchParams.get("for");

    const [cartOpen, setCartOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setCartOpen(false);
    }, [pathname]);

    const updateSearchParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleChipClick = (itemFor: string) => {
        itemFor === filterParam
            ? router.push(pathname)
            : updateSearchParams("for", itemFor);
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
        router.refresh();
    };

    const dispatch = useAppDispatch();

    const baseCartContainerClass =
        "absolute z-20 left-1/2 -translate-x-1/2 top-36 lg:translate-x-0 lg:left-auto lg:top-24 lg:right-10";

    const cartProductsQuantity = userCart?.products.reduce(
        (sum, product) => sum + product.quantity,
        0
    );

    return (
        <header className="w-full bg-stone-50 flex lg:flex-row flex-col justify-between items-center px-20 sticky top-0 z-10 py-10">
            {pathname === "/" ? (
                <ul className="lg:flex gap-2 lg:mt-0 mt-12 hidden">
                    {genderFilterItems.map((item) => (
                        <li key={item.text}>
                            <Chip
                                text={item.text}
                                isActive={item.for === filterParam}
                                onClick={() => handleChipClick(item.for)}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <div />
            )}
            <Link
                className="text-3xl font-semibold absolute left-1/2 -translate-x-1/2"
                onClick={() =>
                    dispatch(userWishlistActions.setActiveWishlist(null))
                }
                href="/"
            >
                FlexDog
            </Link>
            {user ? (
                <div className="flex gap-4 items-center lg:mt-0 mt-14">
                    <p className="py-2 px-4 rounded-xl bg-teal-700 text-white">
                        {user.name.slice(0, 1)}
                    </p>
                    <IconButton
                        onClick={() => {
                            router.push("/wishlists");
                        }}
                    >
                        <HeartIcon />
                    </IconButton>
                    <IconButton onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setCartOpen((prevValue) => !prevValue)}
                    >
                        <CartIcon />
                        {cartProductsQuantity! > 0 && <p className="text-[10px] absolute top-[2px] right-[2px] bg-black text-white rounded-full py-[1px] px-[5px]">
                            {cartProductsQuantity}
                        </p>}
                    </IconButton>
                    <div
                        className={
                            cartOpen
                                ? baseCartContainerClass + " block"
                                : baseCartContainerClass + " hidden"
                        }
                    >
                        <ShoppingCart
                            userCart={userCart as Cart}
                            handleClose={() => setCartOpen(false)}
                        />
                    </div>
                </div>
            ) : (
                <IconButton onClick={() => router.push("/login")}>
                    <UserIcon />
                </IconButton>
            )}
        </header>
    );
};
