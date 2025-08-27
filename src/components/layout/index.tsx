import type { ReactNode } from "react";
import Header from "../header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-[#f2f4f7] min-h-screen flex gap-[20px] flex-col animate-fade-in">
      <Header />
      <div className="px-3">{children}</div>
    </main>
  );
};

export default Layout;
