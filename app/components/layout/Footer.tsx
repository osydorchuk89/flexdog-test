import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-stone-900 py-10 flex md:flex-row flex-col items-center justify-between xl:px-20 lg:px-14 sm:px-10 px-4 text-white gap-4">
            <span>&copy; FlexDog 2025</span>
            <ul className="flex flex-row items-center gap-4 sm:gap-8">
                <li>
                    <Link href="#">O nás</Link>
                </li>
                <li>
                    <Link href="#">Obchody</Link>
                </li>
                <li>
                    <Link href="#">Kontakty</Link>
                </li>
            </ul>
        </footer>
    );
};
