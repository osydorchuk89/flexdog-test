import path from "path";
import fs from "fs/promises";
import { Cart, type Product, type User, type Wishlist } from "./entities";

const usersFilePath = path.join(process.cwd(), "data", "users.json");
const productsFilePath = path.join(process.cwd(), "data", "products.json");
const wishlistsFilePath = path.join(process.cwd(), "data", "wishlists.json");
const cartsFilePath = path.join(process.cwd(), "data", "carts.json");

// helper function for reading users data
export async function fetchUsers(): Promise<User[]> {
    try {
        const usersData = await fs.readFile(usersFilePath, "utf-8");
        return JSON.parse(usersData);
    } catch (error) {
        console.error("Error reading users file:", error);
        return [];
    }
}

// helper function to read products data
export async function fetchProducts(): Promise<Product[]> {
    try {
        const productsData = await fs.readFile(productsFilePath, "utf-8");
        return JSON.parse(productsData);
    } catch (error) {
        console.error("Error reading product file:", error);
        return [];
    }
}

// helper function for getting a map of product ids to its entire objects
export async function getProductsMap(): Promise<Map<string, Product>> {
    try {
        const products = await fetchProducts();
        return new Map(products.map((product) => [product.id, product]));
    } catch (error) {
        console.error("Error reading product file:", error);
        return new Map();
    }
}

// helper function for reading all wishlists
export async function fetchWishlists(): Promise<Wishlist[]> {
    try {
        const wishlistsData = await fs.readFile(wishlistsFilePath, "utf-8");
        return JSON.parse(wishlistsData);
    } catch (error) {
        console.error("Error reading wishlist file:", error);
        return [];
    }
}

// helper function to read carts data
export async function fetchCarts(): Promise<Cart[]> {
    try {
        const cartsData = await fs.readFile(cartsFilePath, "utf-8");
        return JSON.parse(cartsData);
    } catch (error) {
        console.error("Error reading product file:", error);
        return [];
    }
}
