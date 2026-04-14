import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  href,
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) {
  const classes = `btn btn-${variant} ${size === 'large' ? 'btn-large' : ''} ${size === 'small' ? 'btn-small' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type}
      className={classes} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
