"use client";

import { Phone, ArrowRight, Scan } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on signup page
  if (pathname === "/signup") {
    return null;
  }

  const scrollToContact = () => {
    if (pathname !== "/") {
      router.push("/#contact");
      return;
    }

    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border shadow-2xl z-50">
        <div className="grid grid-cols-3 gap-2 p-3">
          <button
            type="button"
            onClick={scrollToContact}
            className="py-3 px-4 bg-secondary text-foreground rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Support</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-full py-3 px-4 bg-accent text-accent-foreground rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Join Now</span>
          </button>
          <button type="button" className="py-3 px-4 bg-primary text-primary-foreground rounded-xl text-sm flex items-center justify-center gap-2">
            <Scan className="w-4 h-4" />
            <span>Scan</span>
          </button>
        </div>
      </div>

      {/* Add padding for mobile bottom bar */}
      <div className="md:hidden h-20" />
    </>
  );
}
