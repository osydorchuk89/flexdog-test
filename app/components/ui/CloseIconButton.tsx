import { CloseIcon } from "./icons/CloseIcon";

interface CloseIconButtonProps {
    handleClick: () => void;
}

export const CloseIconButton = ({ handleClick }: CloseIconButtonProps) => {
    return (
        <div
            className="absolute top-3 right-3 cursor-pointer"
            onClick={handleClick}
        >
            <CloseIcon />
        </div>
    );
};
