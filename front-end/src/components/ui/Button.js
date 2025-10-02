import clsx from 'clsx';

/**
 * Reusable Button component with variant support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, danger, success, warning, info, outline-primary, etc.)
 * @param {string} props.size - Button size (sm, lg)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props passed to button element
 */
export function Button({
  children,
  variant = 'primary',
  size,
  disabled = false,
  loading = false,
  className,
  ...rest
}) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning',
    info: 'btn-info',
    light: 'btn-light',
    dark: 'btn-dark',
    link: 'btn-link',
    outline: 'btn-outline-primary',
    'outline-primary': 'btn-outline-primary',
    'outline-secondary': 'btn-outline-secondary',
    'outline-danger': 'btn-outline-danger',
    'outline-success': 'btn-outline-success',
    'outline-warning': 'btn-outline-warning',
    'outline-info': 'btn-outline-info',
    'outline-light': 'btn-outline-light',
    'outline-dark': 'btn-outline-dark',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    lg: 'btn-lg',
  };

  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    size && sizeClasses[size],
    {
      disabled: disabled || loading,
    },
    className
  );

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...rest}>
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      {children}
    </button>
  );
}
