import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AXON CYBERNETICS // COMMAND CENTER",
  description: "Industrial robotics, cloud architecture, and GRIDPULSE utility telemetry command surface.",
  applicationName: "AXON CYBERNETICS",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
