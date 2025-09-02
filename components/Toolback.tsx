"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  title?: string;          // optional page title if you want it here
  children?: React.ReactNode; // optional right-side actions
};

export default function ToolBack({ title, children }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link
          href="/en/tools"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
          aria-label="Back to Tools"
        >
          <FaArrowLeft aria-hidden /> Back to Tools
        </Link>
        {title ? (
          <h1 className="m-0 font-serif text-2xl md:text-3xl text-brand-green font-extrabold tracking-tight">
            {title}
          </h1>
        ) : null}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
