import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Holistic financial coaching and mortgage solutions in Toronto, English and Spanish.",
};

// Next.js 14+ viewport meta
export const viewport = {
  themeColor: "#F5F2EA", // Updated to your brand beige (can be #ffffff if preferred)
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${lato.variable} ${playfair.variable} ${pacifico.variable}
          font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col antialiased
        `}
      >
        {/* Top Navigation Bar */}
        <NavBar lang="en" />

        {/* Main Content, with spacing for sticky navbar */}
        <main className="flex-1 pt-16 sm:pt-16">{children}</main>

        {/* Site Footer */}
        <Footer lang="en" />

        {/* Back to Top Button */}
        <BackToTopButton />
      </body>
    </html>
  );
}
