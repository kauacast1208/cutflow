import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased bg-[#060606] text-white">
        {children}
      </body>
    </html>
  )
}