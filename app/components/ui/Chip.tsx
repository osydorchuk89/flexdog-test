interface ChipProps {
    text: string;
    isActive?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Chip = ({ text, isActive, onClick }: ChipProps) => {
    const baseClassName =
        "bg-stone-200 rounded-2xl px-6 py-3 hover:bg-stone-400 cursor-pointer";
    const inactiveClassnName = baseClassName + " bg-stone-200";
    const activeClassName = baseClassName + " bg-stone-400";

    return (
        <button
            className={isActive ? activeClassName : inactiveClassnName}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
