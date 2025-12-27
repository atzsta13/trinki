import { triggerHaptic, HapticType } from '../../logic/haptics';

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, style = {}, type = 'button', className = '' }) => {
    const combinedClasses = [
        'btn',
        `btn-${variant}`,
        fullWidth ? 'full-width' : '',
        className
    ].filter(Boolean).join(' ');

    const handlePress = () => {
        triggerHaptic(HapticType.SELECTION);
    };

    return (
        <button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            onPointerDown={handlePress}
            style={style}
        >
            {children}
        </button>
    );
};

export default Button;
