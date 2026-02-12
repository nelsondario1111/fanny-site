"use client";

type FixedParallaxBackdropProps = {
  src: string;
  className?: string;
};

export default function FixedParallaxBackdrop({
  src,
  className = "",
}: FixedParallaxBackdropProps) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`.trim()} aria-hidden="true">
      {/* Desktop: true fixed-attachment background anchored to viewport */}
      <div
        className="absolute inset-0 hidden md:block bg-center bg-cover bg-fixed"
        style={{ backgroundImage: `url('${src}')` }}
      />
      {/* Mobile fallback: regular cover background (fixed attachment is unreliable on mobile browsers) */}
      <div
        className="absolute inset-0 md:hidden bg-center bg-cover"
        style={{ backgroundImage: `url('${src}')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/16 via-black/6 to-black/14" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.13),transparent_40%),radial-gradient(circle_at_83%_76%,rgba(211,182,122,0.10),transparent_35%)] mix-blend-soft-light" />
    </div>
  );
}
