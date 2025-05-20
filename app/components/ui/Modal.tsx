interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, children }: ModalProps) => {
    const baseClassName =
        "fixed flex justify-center items-center z-10 left-0 top-0 w-full h-full bg-black/75";
    const openClassName = "block " + baseClassName;
    const closeClassName = "hidden " + baseClassName;

    return (
        <div className={isOpen ? openClassName : closeClassName}>
            {children}
        </div>
    );
};
