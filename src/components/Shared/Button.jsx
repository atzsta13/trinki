import { triggerHaptic, HapticType } from '../../logic/haptics';

const Button = ({ children, variant = 'primary', className = '', type = 'button', ...props }) => (
    <button
        type={type}
        className={`btn btn-${variant} ${className}`}
        onPointerDown={() => triggerHaptic(HapticType.SELECTION)}
        {...props}
    >
        {children}
    </button>
);

export default Button;
