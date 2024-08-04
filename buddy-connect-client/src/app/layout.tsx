import { SocketProvider } from "../context/socket";
import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SocketProvider>
        <body className="bg-slate-900">{children}</body>
      </SocketProvider>
    </html>
  );
}
