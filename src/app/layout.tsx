import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://axon-cybernetics-tz5e.vercel.app"),
  title: "AXON CYBERNETICS // INTELLIGENCE THAT MOVES",
  description:
    "AXON Cybernetics is an independent robotics engineering collective developing future autonomous machines across software intelligence, embedded systems, and physical robotics.",
  applicationName: "AXON CYBERNETICS",
  authors: [
    { name: "Koglesh R. Murugan" },
    { name: "Yennamutan Muthukumaran" },
  ],
  creator: "AXON CYBERNETICS",
  keywords: [
    "AXON Cybernetics",
    "robotics",
    "autonomous robotics",
    "robotics engineering",
    "embedded systems",
    "artificial intelligence",
    "GRIDPULSE",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "AXON CYBERNETICS // INTELLIGENCE THAT MOVES",
    description:
      "Independent robotics engineering across software intelligence, embedded systems, and physical machines.",
    url: "https://axon-cybernetics-tz5e.vercel.app",
    siteName: "AXON CYBERNETICS",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
