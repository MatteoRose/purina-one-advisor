"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";
import AddToCartFeedback from "@/components/cart/AddToCartFeedback";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <>
      <BackgroundEffects />
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
      <AddToCartFeedback />
    </>
  );
}
