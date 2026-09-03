type XLogoIconProps = {
  size?: number;
  className?: string;
};

export default function XLogoIcon({ size = 16, className = "" }: XLogoIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-8.503-6.618 8.503H.0l8.601-9.83L0 1.153h7.594l5.243 7.71 6.064-7.71Zm-1.29 19.53h2.03L7.084 3.24H4.92l13.69 17.443Z" />
    </svg>
  );
}
