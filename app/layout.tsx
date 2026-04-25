import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saran Zafar — Software Engineer",
  description:
    "Software Engineer and Full Stack Developer from Kashmir. Building scalable systems and modern web applications.",
};

const themeScript = `
  try {
    var t = localStorage.getItem('theme');
    var d = document.documentElement;
    if (t === 'light') {
      d.classList.remove('dark');
      d.style.colorScheme = 'light';
    } else {
      d.classList.add('dark');
      d.style.colorScheme = 'dark';
    }
  } catch(e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased grain">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
