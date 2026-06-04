const SundaDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 py-8 ${className}`} aria-hidden="true">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/60 to-gold/30" />
    <svg width="120" height="20" viewBox="0 0 120 20" fill="none" className="text-gold">
      <path
        d="M0 10 L10 4 L20 10 L30 4 L40 10 L50 4 L60 10 L70 4 L80 10 L90 4 L100 10 L110 4 L120 10"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="60" cy="10" r="3.5" fill="currentColor" />
      <circle cx="20" cy="10" r="1.5" fill="currentColor" />
      <circle cx="100" cy="10" r="1.5" fill="currentColor" />
    </svg>
    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/60 to-gold/30" />
  </div>
);

export default SundaDivider;
