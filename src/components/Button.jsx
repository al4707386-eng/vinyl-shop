export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button className={`btn btn--${variant} ${className}`} type={type} {...rest}>
      {children}
    </button>
  );
}