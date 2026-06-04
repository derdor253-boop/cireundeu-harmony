interface LogoProps {
  className?: string;
}

// Stylized Cireundeu mark: three mountains (Cimenteng, Jambul, Gajahlangu)
// + reundeu leaf + sun, set in a circular badge.
const Logo = ({ className = "h-10 w-10" }: LogoProps) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Logo Kampung Adat Cireundeu"
  >
    <circle cx="32" cy="32" r="30" className="fill-forest" />
    <circle cx="32" cy="32" r="27" className="fill-none stroke-gold" strokeWidth="1.2" />
    {/* sun */}
    <circle cx="32" cy="22" r="3.2" className="fill-gold" />
    {/* mountains */}
    <path
      d="M10 46 L24 26 L32 36 L42 22 L54 46 Z"
      className="fill-cream"
    />
    <path d="M10 46 L24 26 L32 36 L42 22 L54 46" className="fill-none stroke-forest" strokeWidth="1.2" strokeLinejoin="round" />
    {/* leaf */}
    <path
      d="M32 50 C 26 50 22 46 22 42 C 28 42 32 46 32 50 Z"
      className="fill-gold"
    />
    <path
      d="M32 50 C 38 50 42 46 42 42 C 36 42 32 46 32 50 Z"
      className="fill-gold"
    />
    <line x1="32" y1="50" x2="32" y2="42" className="stroke-forest" strokeWidth="1" />
    {/* base ground */}
    <rect x="10" y="46" width="44" height="2" className="fill-terracotta" />
  </svg>
);

export default Logo;
