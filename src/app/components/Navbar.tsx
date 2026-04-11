"use client";

import { motion } from "motion/react";
import { Menu, X, QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      setMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl tracking-tight">Safe Safar</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("use-cases")}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Use Cases
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("benefits")}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Benefits
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/signup")}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              Join Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-6 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("use-cases")}
                className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                Use Cases
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("benefits")}
                className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                Benefits
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/signup");
                }}
                className="w-full mt-4 px-6 py-3 bg-accent text-accent-foreground rounded-xl shadow-sm"
              >
                Join Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
