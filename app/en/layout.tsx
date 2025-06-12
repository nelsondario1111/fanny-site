import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Holistic financial coaching and mortgage solutions in Toronto, English and Spanish.",
};

// ✅ Move themeColor here for Next.js 14+ compatibility
export const viewport = {
  themeColor: "#ffffff", // Change this to your preferred color if needed
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`
          ${lato.variable} ${playfair.variable} ${pacifico.variable}
          font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col antialiased
        `}
      >
        <NavBar lang="en" />
        {/* Responsive top padding for navbar */}
        <main className="flex-1 pt-16 sm:pt-16">{children}</main>
        <Footer lang="en" />
        <BackToTopButton />
      </body>
    </html>
  );
}
