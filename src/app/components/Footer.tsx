import { QrCode, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <QrCode className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl tracking-tight">Safe Safar</span>
            </div>
            <p className="text-white/70 max-w-md">
              Smart parking solution for Karachi. Connect without sharing your number. Stay safe, stay reachable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/#how-it-works" className="text-white/70 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="/#use-cases" className="text-white/70 hover:text-white transition-colors">
                Use Cases
              </Link>
              <Link href="/signup" className="text-white/70 hover:text-white transition-colors">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@safesafar.pk</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Karachi, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>Â© 2026 Safe Safar. Made for Karachi with care.</p>
        </div>
      </div>
    </footer>
  );
}
