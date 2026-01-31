interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle - main coin */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="url(#coinGradient)"
        stroke="url(#coinBorder)"
        strokeWidth="3"
      />

      {/* Inner ring detail */}
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="url(#innerRing)"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Dollar sign or "C" monogram */}
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="28"
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill="url(#textGradient)"
      >
        C
      </text>

      {/* Small accent coins behind */}
      <circle
        cx="52"
        cy="16"
        r="10"
        fill="url(#accentCoin1)"
        opacity="0.7"
      />
      <circle
        cx="52"
        cy="16"
        r="7"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1"
        opacity="0.5"
      />

      <circle
        cx="14"
        cy="50"
        r="8"
        fill="url(#accentCoin2)"
        opacity="0.6"
      />
      <circle
        cx="14"
        cy="50"
        r="5.5"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Gradients */}
      <defs>
        {/* Main coin gradient - gold/amber */}
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Coin border */}
        <linearGradient id="coinBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Inner ring */}
        <linearGradient id="innerRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        {/* Text gradient */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Accent coin 1 - gold */}
        <linearGradient id="accentCoin1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Accent coin 2 - silver */}
        <linearGradient id="accentCoin2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Simplified version for small sizes (favicon, etc.)
export function LogoSimple({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Single coin */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="url(#simpleCoinGradient)"
        stroke="#b45309"
        strokeWidth="3"
      />

      {/* Inner ring */}
      <circle
        cx="32"
        cy="32"
        r="21"
        fill="none"
        stroke="#fef3c7"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* C monogram */}
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="28"
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill="#78350f"
      >
        C
      </text>

      <defs>
        <linearGradient id="simpleCoinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Dark mode variant with blue accent
export function LogoDark({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer glow ring */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Main coin */}
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="url(#darkCoinGradient)"
        stroke="url(#darkCoinBorder)"
        strokeWidth="2.5"
      />

      {/* Inner ring detail */}
      <circle
        cx="32"
        cy="32"
        r="20"
        fill="none"
        stroke="#fef3c7"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Stacked coin effect */}
      <ellipse
        cx="32"
        cy="38"
        rx="20"
        ry="4"
        fill="#92400e"
        opacity="0.4"
      />

      {/* C monogram */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="26"
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill="url(#darkTextGradient)"
      >
        C
      </text>

      <defs>
        <linearGradient id="darkCoinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <linearGradient id="darkCoinBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <linearGradient id="darkTextGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
    </svg>
  )
}
