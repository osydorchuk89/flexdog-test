interface IconButtonProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const IconButton = ({ children, onClick }: IconButtonProps) => {
    return (
        <div
            className="relative p-2 rounded-xl hover:bg-stone-300 border-1 border-stone-300 cursor-pointer"
            onClick={onClick}
        >
            {children}
        </div>
    );
};
