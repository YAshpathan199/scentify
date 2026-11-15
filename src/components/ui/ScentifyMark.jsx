export default function ScentifyMark({ className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 92"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Upper crescent — thick at right outer curve, thin at both ends */}
      {/* Drawn first so lower crescent crosses in front at the waist */}
      <path
        d="M 20 14
           C 36 8, 54 18, 54 28
           C 54 40, 44 50, 30 50
           C 24 46, 28 38, 30 28
           C 32 18, 26 12, 20 14 Z"
        fill="currentColor"
      />
      {/* Lower crescent — thick at left outer curve, thin at both ends */}
      {/* Drawn on top, creates crossing depth */}
      <path
        d="M 34 44
           C 24 50, 10 56, 8 66
           C 6 76, 16 86, 30 86
           C 44 86, 54 78, 52 68
           C 44 68, 36 64, 34 56
           C 32 50, 34 46, 34 44 Z"
        fill="currentColor"
      />
      {/* Gold accent dot at the waist crossing */}
      <circle cx="31" cy="47" r="4" fill="#C9A86A" />
    </svg>
  );
}
