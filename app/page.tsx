import { cookies } from "next/headers";
import { Products } from "./components/Products";
import { getProducts, getUserWishlists } from "../lib/actions";
import { User } from "../lib/entities";
import { AddToWishlistModal } from "./components/AddToWishlistModal";
import { WishlistFormModal } from "./wishlists/components/WishlistFormModal";
import { RedirectToLoginModal } from "./components/RedirectToLoginModal";

export default async function HomePage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("userSession");
    const user: User | undefined = session ? JSON.parse(session.value) : undefined;

    const wishlists = (user && (await getUserWishlists(user.id))) || [];

    const products = await getProducts();

    if (!products) {
        return (
            <p className="min-h-[80vh] flex justify-center items-center">
                Něco se pokazilo. Zkuste to prosím později
            </p>
        );
    }

    return (
        <div className="min-h-[80vh] py-10 xl:px-20 lg:px-14 sm:px-10 px-4 flex flex-col gap-10">
            <h2 className="text-2xl font-bold text-center">Všechny produkty</h2>
            <Products products={products} wishlists={wishlists} user={user} />
            <RedirectToLoginModal />
            {user && <AddToWishlistModal wishlists={wishlists} />}
            {user && <WishlistFormModal userId={user.id} />}
        </div>
    );
}
