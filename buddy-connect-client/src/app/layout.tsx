import { SocketProvider } from "../context/socket";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SocketProvider>
        <body>{children}</body>
      </SocketProvider>
    </html>
  );
}
