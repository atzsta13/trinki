import { triggerHaptic, HapticType } from '../../logic/haptics';

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, style = {}, type = 'button', className = '', disabled = false }) => {
    const combinedClasses = [
        'btn',
        `btn-${variant}`,
        fullWidth ? 'full-width' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            onPointerDown={() => triggerHaptic(HapticType.SELECTION)}
            disabled={disabled}
            style={disabled ? { opacity: 0.5, pointerEvents: 'none', ...style } : style}
        >
            {children}
        </button>
    );
};

export default Button;
