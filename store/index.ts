import { createSlice, configureStore } from "@reduxjs/toolkit";

import { type Wishlist } from "../lib/entities";

interface ModalState {
    wishlistFormOpen: boolean;
    addToWishlistFormOpen: boolean;
    wishlistProductId: string;
    deleteWishlistOpen: boolean;
    wishlistUrlOpen: boolean;
    wishlistId: string;
    changeWishlist: boolean;
    addToCartOpen: boolean;
    redirectToLoginOpen: boolean;
}

interface UserWishlistState {
    wishlists: Wishlist[] | null;
    activeWishlist: Wishlist | null;
    previousWishlist: Wishlist | null;
}

const initialModalState: ModalState = {
    wishlistFormOpen: false,
    addToWishlistFormOpen: false,
    wishlistProductId: "",
    deleteWishlistOpen: false,
    wishlistUrlOpen: false,
    wishlistId: "",
    changeWishlist: false,
    addToCartOpen: false,
    redirectToLoginOpen: false,
};

const initialUserWishlistState: UserWishlistState = {
    wishlists: null,
    activeWishlist: null,
    previousWishlist: null,
};

const modalSlice = createSlice({
    name: "modals",
    initialState: initialModalState,
    reducers: {
        openWishlistForm(state) {
            state.wishlistFormOpen = true;
        },
        closeWishlistForm(state) {
            state.wishlistFormOpen = false;
        },
        openAddToWishlistForm(state) {
            state.addToWishlistFormOpen = true;
        },
        closeAddToWishListForm(state) {
            state.addToWishlistFormOpen = false;
        },
        setWishlistProductId(state, action) {
            state.wishlistProductId = action.payload;
        },
        openDeleteWishlist(state) {
            state.deleteWishlistOpen = true;
        },
        closeDeleteWishlist(state) {
            state.deleteWishlistOpen = false;
        },
        openWishlistUrl(state) {
            state.wishlistUrlOpen = true;
        },
        closeWishlistUrl(state) {
            state.wishlistUrlOpen = false;
        },
        setWishlistId(state, action) {
            state.wishlistId = action.payload;
        },
        setChangeWishlist(state, action) {
            state.changeWishlist = action.payload;
        },
        openAddToCart(state) {
            state.addToCartOpen = true;
        },
        closeAddToCart(state) {
            state.addToCartOpen = false;
        },
        openRedirectToLogin(state) {
            state.redirectToLoginOpen = true;
        },
        closeRedirectToLogin(state) {
            state.redirectToLoginOpen = false;
        },
    },
});

const userWishlistSlice = createSlice({
    name: "userWishlists",
    initialState: initialUserWishlistState,
    reducers: {
        setUserWishlists(state, action) {
            state.wishlists = action.payload;
        },
        setActiveWishlist(state, action) {
            state.activeWishlist = action.payload;
        },
        setPreviousWishList(state, action) {
            state.previousWishlist = action.payload;
        },
    },
});

export const store = configureStore({
    reducer: {
        modals: modalSlice.reducer,
        userWishlists: userWishlistSlice.reducer,
    },
});
export const modalActions = modalSlice.actions;
export const userWishlistActions = userWishlistSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
