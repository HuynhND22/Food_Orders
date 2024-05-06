"use client";

import { Providers } from "./providers";
import "./../css/main.css";
type LayoutProps = { children: React.ReactNode };

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body>
        {/* <body> */}
        <Providers>{children}</Providers>
        {/* </body> */}
      </body>
    </html>
  );
}
