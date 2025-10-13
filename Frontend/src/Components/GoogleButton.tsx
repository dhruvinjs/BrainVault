import { Loader2 } from "lucide-react";

interface GoogleButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

export const GoogleButton = ({ onClick, disabled, isLoading }: GoogleButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
                flex items-center justify-center gap-2 w-full max-w-xs 
                bg-white text-gray-700 border border-gray-300 rounded-md 
                hover:bg-gray-100 transition-colors font-medium px-4 py-2 
                shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    {/* Google Logo SVG */}
                    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                        <path fill="#4285F4" d="M533.5 278.4c0-17.2-1.4-33.8-4-49.8H272v94.5h146.9c-6.4 34.5-25.5 63.8-54.7 83.5l88.4 68c51.7-47.8 81-118 81-196.2z"/>
                        <path fill="#34A853" d="M272 544.3c73.4 0 135.2-24.4 180.2-66.5l-88.4-68c-24.5 16.3-55.8 25.8-91.8 25.8-70.6 0-130.5-47.6-152-111.5l-89.2 69c44.1 87.1 134.4 151.2 241.2 151.2z"/>
                        <path fill="#FBBC05" d="M120 323.1c-10.2-30.5-10.2-63.4 0-93.9L30.8 160.2C-4.6 221.6-4.6 322.7 30.8 384.1l89.2-69z"/>
                        <path fill="#EA4335" d="M272 107.2c38.6 0 73.3 13.3 100.7 39.5l75.5-75.5C407.2 25.2 345.4 0 272 0 165.1 0 74.8 64.1 30.8 151.2l89.2 69C141.5 154.8 201.4 107.2 272 107.2z"/>
                    </svg>
                    <span>Sign in with Google</span>
                </>
            )}
        </button>
    );
};
