export function Icon({
  name,
  className = "",
  filled = false,
  size,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size ? `${size}px` : undefined,
        fontVariationSettings: filled ? '"FILL" 1, "wght" 400' : '"FILL" 0, "wght" 400',
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
