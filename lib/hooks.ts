import { useEffect } from "react";

export const useModalClose = (
    closeFunction: () => void,
    modalRef: React.RefObject<HTMLDivElement>
) => {
    useEffect(() => {
        const handleClickOutsideModal = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                closeFunction();
            }
        };
        document.addEventListener("mousedown", handleClickOutsideModal);
        return () =>
            document.removeEventListener("mousedown", handleClickOutsideModal);
    }, [closeFunction]);
};
