import axios, { AxiosError } from "axios";

import { type Cart, type Product, type User, type Wishlist } from "./entities";

export const BASE_URL = "http://localhost:3000";

export const sendLoginData = async (loginData: FormData) => {
    try {
        const userResponse = await axios<User>({
            method: "post",
            url: BASE_URL + "/api/users",
            data: {
                email: loginData.get("email"),
                password: loginData.get("password"),
            },
        });
        return { user: userResponse.data };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
            return {
                errorMessage:
                    "Zadané údaje jsou neplatné. Zkontrolujte je prosím znovu",
            };
        }
        return {
            errorMessage: "Něco se pokazilo. Zkuste to prosím později",
        };
    }
};

export const logout = async () => {
    try {
        await axios({
            method: "post",
            url: BASE_URL + "/api/auth",
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProducts = async () => {
    try {
        const productsResponse = await axios<Product[]>({
            method: "get",
            url: BASE_URL + "/api/products",
        });
        return productsResponse.data;
    } catch (error) {
        console.log(error);
    }
};

export const getUserWishlists = async (userId: string) => {
    try {
        const wishlistsResponse = await axios<Wishlist[]>({
            method: "get",
            url: `${BASE_URL}/api/wishlists?userId=${userId}`,
        });
        return wishlistsResponse.data;
    } catch (error) {
        console.log(error);
    }
};

export const getWishlist = async (wishlistId: string) => {
    try {
        const wishlistResponse = await axios<Wishlist>({
            method: "get",
            url: `${BASE_URL}/api/wishlists/${wishlistId}`,
        });
        return wishlistResponse.data;
    } catch (error) {
        console.log(error);
    }
};

export const createOrUpdateWishlist = async (wishlistData: Wishlist) => {
    try {
        const wishListResponse = await axios({
            method: "post",
            url: BASE_URL + "/api/wishlists",
            data: {
                ...wishlistData,
            },
        });
        return { wishlist: wishListResponse.data };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 400) {
            return {
                errorMessage: error.response?.data.errors,
            };
        }
        return {
            errorMessage: [
                { error: "Něco se pokazilo. Zkuste to prosím později" },
            ],
        };
    }
};

export const addOrRemoveFromWishList = async (
    productId: string,
    wishlistId: string,
    changeWishlist?: boolean
) => {
    try {
        await axios({
            method: "put",
            url: `${BASE_URL}/api/wishlists/${wishlistId}`,
            data: {
                productId,
                changeWishlist,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

export const deleteWishList = async (wishlistId: string) => {
    try {
        await axios({
            method: "delete",
            url: `${BASE_URL}/api/wishlists/${wishlistId}`,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getUserCart = async (userId: string) => {
    try {
        const userCartResult = await axios<Cart>({
            method: "get",
            url: `${BASE_URL}/api/carts?userId=${userId}`,
        });
        return userCartResult.data;
    } catch (error) {
        console.log(error);
    }
};

export const addOrRemoveFromCart = async (
    userId: string,
    productId: string,
    remove?: boolean
) => {
    try {
        await axios({
            method: "put",
            url: `${BASE_URL}/api/carts?userId=${userId}`,
            data: { productId, remove },
        });
    } catch (error) {
        console.log(error);
    }
};

export const clearCart = async (userId: string) => {
    try {
        await axios({
            method: "delete",
            url: `${BASE_URL}/api/carts?userId=${userId}`,
        });
    } catch (error) {
        console.log(error);
    }
};
