export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface AuthStatus {
    isLoggedIn: boolean;
    user?: User;
}

export interface Product {
    id: string;
    type: string;
    brand: string;
    model: string;
    for: string;
    price: number;
    image_url: string;
    available: boolean;
}

export interface Wishlist {
    id: string;
    userId: string;
    name: string;
    description: string;
    isDefault: boolean;
    isPublic: boolean;
    products: string[] | Product[];
}

export interface Cart {
    id: string;
    userId: string;
    products: { id: string | Product; quantity: number }[];
}
