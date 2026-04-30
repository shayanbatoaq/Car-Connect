"use client";

import { Phone, ArrowRight, Scan } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on focused full-screen style flows
  if (pathname === "/signup" || pathname === "/demo" || pathname === "/scan") {
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
        <div className="grid grid-cols-3 gap-2 p-2 sm:p-3">
          <button
            type="button"
            onClick={scrollToContact}
            className="min-w-0 py-3 px-2 sm:px-4 bg-secondary text-foreground rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span className="truncate">Support</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="min-w-0 w-full py-3 px-2 sm:px-4 bg-accent text-accent-foreground rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span className="truncate">Join Now</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/scan")}
            className="min-w-0 py-3 px-2 sm:px-4 bg-primary text-primary-foreground rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <Scan className="w-4 h-4 shrink-0" />
            <span className="truncate">Scan</span>
          </button>
        </div>
      </div>

      {/* Add padding for mobile bottom bar */}
      <div className="md:hidden h-20" />
    </>
  );
}
