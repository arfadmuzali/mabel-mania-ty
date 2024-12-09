import Footer from "@/components/layouts/Footer";
import Nav from "@/components/layouts/Nav";

export default function LobbyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
