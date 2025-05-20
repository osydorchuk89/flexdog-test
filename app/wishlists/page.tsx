import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUserWishlists } from "../../lib/actions";
import { Wishlists } from "./components/Wishlists";
import { WishlistFormModal } from "./components/WishlistFormModal";
import { type User } from "../../lib/entities";
import { WishlistUrlModal } from "./components/WishlistUrlModal";
import { AddToWishlistModal } from "../components/AddToWishlistModal";
import { AddToCartModal } from "./components/AddToCartModal";

export default async function WishlistsPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("userSession");

    if (!session) {
        redirect("/");
    }

    const user: User = JSON.parse(session.value);

    const wishlists = await getUserWishlists(user.id);

    if (!wishlists) {
        return (
            <p className="min-h-[80vh] flex justify-center items-center">
                "Něco se pokazilo. Zkuste to prosím později"
            </p>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col py-10 xl:px-20 lg:px-14 sm:px-10 px-4 gap-10">
            <h2 className="text-2xl font-bold text-center">Mojé wishlisty</h2>
            <Wishlists wishlists={wishlists} user={user} />
            <WishlistFormModal userId={user.id} />
            <WishlistUrlModal />
            {user && <AddToWishlistModal wishlists={wishlists} />}
            {user && <AddToCartModal />}
        </div>
    );
}
