type Size = "sm" | "md";

const sizeMap: Record<Size, string> = {
    sm: "w-[22px] h-[22px] rounded-md",
    md: "w-8 h-8 rounded-lg",
};

export default function LogoMark({ size = "md" }: { size?: Size }) {
    return (
        <span
            className={`${sizeMap[size]} relative flex items-center justify-center bg-jade-800 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]`}
        >
            <span
                aria-hidden
                className="absolute w-4 h-[18px] bg-coral-500"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--color-amber-500) 0 0), linear-gradient(var(--color-amber-500) 0 0)",
                    backgroundSize: "12px 2px, 2px 14px",
                    backgroundPosition: "center, center",
                    backgroundRepeat: "no-repeat, no-repeat",
                    clipPath: "polygon(0 35%, 50% 0, 100% 35%, 100% 100%, 0 100%)",
                }}
            />
        </span>
    );
}
