import { ReactElement } from "react";
import { Loader2 } from "lucide-react";  // Assuming you want to use this icon for loading

interface ButtonProps {
    variant: 'primary' | 'secondary' | 'dark' | 'danger',
    size: 'sm' | 'md' | 'lg',
    onClick: () => void,
    text: string,
    startIcon?: ReactElement,
    className?: string,
    disabled?:boolean
}

const variants = {
    'primary': 'bg-purple-500 outline-none',
    'secondary': "bg-purple-300 outline-none",
    'dark': 'bg-gray-200 text-black outline-none',
    'danger': "bg-red-600 text-white hover:bg-red-700",
}

const sizes = {
    "sm": 'py-1 px-3 rounded-sm',
    'md': 'py-2 px-6 rounded-md',
    'lg': 'py-4 px-9 rounded-xl'
}

const defaultStyle = "flex items-center justify-center cursor-pointer"

export const Button = (props: ButtonProps) => {
    return (
        <button
            className={`${variants[props.variant]} 
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} 
            ${defaultStyle} ${sizes[props.size]} ${props.className}`}
            onClick={props.onClick}
            disabled={props.disabled} 
        >
            {props.disabled ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin cursor-not-allowed" />
                    <span>Loading...</span>
                </div>
            ) : (
                <>
                    {props.startIcon && <div className="pr-2">{props.startIcon}</div>}
                    {props.text}
                </>
            )}
        </button>
    )
}
