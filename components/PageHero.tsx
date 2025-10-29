import React from "react";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
}

export function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center bg-black text-white">
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover object-center brightness-[0.55]"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-md md:text-xl text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
