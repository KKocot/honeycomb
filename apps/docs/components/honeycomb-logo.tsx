interface HoneycombLogoProps {
  className?: string;
}

// Precomputed honeycomb pattern: 7 flat-top hexagons (1 center + 6 surrounding)
// R=40, GAP=3, D=83, center=(128,128), viewBox 256x256
const CENTER = "168,128 148,162.6 108,162.6 88,128 108,93.4 148,93.4";
const NEIGHBORS = [
  "251,128 231,162.6 191,162.6 171,128 191,93.4 231,93.4",
  "209.5,56.1 189.5,90.7 149.5,90.7 129.5,56.1 149.5,21.5 189.5,21.5",
  "126.5,56.1 106.5,90.7 66.5,90.7 46.5,56.1 66.5,21.5 106.5,21.5",
  "85,128 65,162.6 25,162.6 5,128 25,93.4 65,93.4",
  "126.5,199.9 106.5,234.5 66.5,234.5 46.5,199.9 66.5,165.3 106.5,165.3",
  "209.5,199.9 189.5,234.5 149.5,234.5 129.5,199.9 149.5,165.3 189.5,165.3",
];

export function HoneycombLogo({ className }: HoneycombLogoProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {NEIGHBORS.map((points, i) => (
        <polygon key={i} points={points} fill="#E31337" opacity="0.35" />
      ))}
      <polygon points={CENTER} fill="#E31337" />
    </svg>
  );
}
