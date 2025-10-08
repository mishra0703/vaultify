import "./globals.css";
import Navbar from "@/components/Navbar";
import { poppins } from "@/lib/font";
import SessionWrapper from "@/components/SessionWrapper";


export const metadata = {
  title: "Vaultify : Password Manager",
  description:
    "A password manager web application that stores your website url , your username/id and password that only you can access it.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
        <div className="background min-h-screen w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="second-bg min-h-screen w-full bg-[radial-gradient(circle_1000px_at_100%_100px,#d5c5ff,#fff90025)]">
            <SessionWrapper>
              <Navbar />
              {children}
            </SessionWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}
