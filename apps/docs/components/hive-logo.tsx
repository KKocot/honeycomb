interface HiveLogoProps {
  className?: string;
}

export function HiveLogo({ className }: HiveLogoProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M128 16L236 72V184L128 240L20 184V72L128 16Z"
        fill="#E31337"
      />
      <path
        d="M128 48L200 88V168L128 208L56 168V88L128 48Z"
        fill="currentColor"
        className="text-background"
      />
      <path
        d="M128 80L164 100V140L128 160L92 140V100L128 80Z"
        fill="#E31337"
      />
    </svg>
  );
}
