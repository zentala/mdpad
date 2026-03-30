/**
 * Logo — mdpad `#>` logo rendered as inline SVG.
 * Uses Iosevka Bold outlined paths for consistent rendering everywhere.
 * Supports size and color props. Color defaults to currentColor.
 */

interface LogoProps {
  size?: number
  color?: string
  className?: string
  title?: string
}

/** Iosevka Bold glyph paths for # and > (UPM: 1000, advance: 500 each) */
const HASH_PATH = 'M96 18V180H16V276H96V459H16V555H96V717H197V555H303V717H404V555H484V459H404V276H484V180H404V18H303V180H197V18ZM197 276H303V459H197Z'
const GT_PATH = 'M585 68L533 142L857 340L533 538L585 612L941 391V289Z'

export function Logo({ size = 20, color, className, title = 'mdpad' }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 735"
      width={size}
      height={size * 0.735}
      className={className}
      role="img"
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <g transform="translate(0,735) scale(1,-1)" fill={color ?? 'currentColor'}>
        <path d={HASH_PATH} />
        <path d={GT_PATH} />
      </g>
    </svg>
  )
}
