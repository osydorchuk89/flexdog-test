interface ButtonProps {
    text: string;
    disabled?: boolean;
    type?: "submit" | "reset" | "button" | undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ text, disabled, type, onClick }: ButtonProps) => {
    return (
        <button
            className="rounded-lg text-stone-950 font-bold px-8 py-3 hover:bg-stone-200 border-1 border-stone-300 cursor-pointer"
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {text}
        </button>
    );
};
