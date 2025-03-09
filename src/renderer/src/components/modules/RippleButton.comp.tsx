import { useState } from "react";
const delay = 300;

const RippleButton = ({ className = "btn", onClickHandler = null as (() => void) | null, style = {}, rippleDelay = delay, children }) => {
    const [ripples, setRipples] = useState<{ id: number; left: number; top: number }[]>([]);

    const handleClick = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const horizontalPos = e.clientX - rect.left;
        const verticalPos = e.clientY - rect.top;
        const newRipple = { id: Date.now(), left: horizontalPos, top: verticalPos };

        setRipples((prev) => [...prev, newRipple]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
            if (onClickHandler) onClickHandler();
        }, rippleDelay);
    };

    return (
        <span role="button" className={`ripple-btn  ${className}`} onClick={handleClick} style={style}>
            {children}
            {ripples.map((ripple) => (
                <span key={ripple.id} style={{ left: ripple.left, top: ripple.top, animationDuration: `${rippleDelay}ms` }}></span>
            ))}
        </span>
    );
};

export default RippleButton;
