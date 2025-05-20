import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { type User } from "@/lib/entities";
import { getUserWishlists, getWishlist } from "@/lib/actions";
import { WishlistContent } from "../components/WishlistContent";
import { WishlistFormModal } from "../components/WishlistFormModal";
import { DeleteWishlistModal } from "../components/DeleteWishlistModal";
import { AddToWishlistModal } from "@/app/components/AddToWishlistModal";
import { AddToCartModal } from "../components/AddToCartModal";
import { RedirectToLoginModal } from "@/app/components/RedirectToLoginModal";

export default async function WishlistPage({
    params,
}: {
    params: Promise<{ wishlistId: string }>;
}) {
    const { wishlistId } = await params;

    const cookieStore = await cookies();
    const session = cookieStore.get("userSession");
    const user: User | undefined = session
        ? JSON.parse(session.value)
        : undefined;

    const wishlists = (user && (await getUserWishlists(user.id))) || [];

    const wishlist = await getWishlist(wishlistId);

    if (!wishlist || !wishlist.isPublic) {
        redirect("/");
    }

    return (
        <div className="min-h-[80vh] flex flex-col py-10 xl:px-20 lg:px-14 sm:px-10 px-4 gap-10">
            <WishlistContent
                user={user}
                wishlists={wishlists}
                wishlist={wishlist}
            />
            {user && user.id === wishlist.userId && (
                <WishlistFormModal userId={user.id} />
            )}
            {user && user.id === wishlist.userId && (
                <DeleteWishlistModal wishlistId={wishlist.id} />
            )}
            {user && user.id === wishlist.userId && (
                <AddToWishlistModal wishlists={wishlists} />
            )}
            {user && user.id === wishlist.userId && <AddToCartModal />}
            <RedirectToLoginModal />
        </div>
    );
}
