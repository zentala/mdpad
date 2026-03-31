/**
 * Logo — mdpad `#_` logo rendered as inline SVG.
 * Uses Iosevka Bold outlined paths for consistent rendering everywhere.
 * Supports size and color props. Color defaults to currentColor.
 */

interface LogoProps {
  size?: number
  color?: string
  className?: string
  title?: string
}

/** Iosevka Bold glyph paths for # and _ (UPM: 1000, advance: 500 each) */
const HASH_PATH =
  'M96 18V180H16V276H96V459H16V555H96V717H197V555H303V717H404V555H484V459H404V276H484V180H404V18H303V180H197V18ZM197 276H303V459H197Z'
const UNDERSCORE_PATH = 'M533 0H941V80H533Z'

export function Logo({ size = 20, color, className, title = 'mdpad' }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 735"
      width={size}
      height={size * 0.735}
      className={`logo-hover-blink ${className ?? ''}`}
      role="img"
      aria-label={title}
    >
      <style>{`
        .logo-hover-blink:hover .logo-cursor {
          animation: cursor-blink 1s step-end infinite;
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      {title && <title>{title}</title>}
      <g transform="translate(0,735) scale(1,-1)" fill={color ?? 'currentColor'}>
        <path d={HASH_PATH} />
        <path className="logo-cursor" d={UNDERSCORE_PATH} />
      </g>
    </svg>
  )
}
