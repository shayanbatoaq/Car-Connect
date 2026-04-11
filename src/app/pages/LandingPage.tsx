"use client";

import { motion } from "motion/react";
import {
  QrCode,
  UserPlus,
  Car,
  Scan,
  Ban,
  Lightbulb,
  AlertTriangle,
  Phone,
  Building,
  ShoppingBag,
  Shield,
  PhoneOff,
  Users,
  Sparkles,
  ArrowRight,
  Droplet,
  Wrench,
  Coffee,
  Activity,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";

export function LandingPage() {
  const router = useRouter();
  const benefitsCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1642622420476-a20517d3cab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Karachi city traffic"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-sm text-primary">Made for Karachi</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
              Park smarter.<br />
              Stay reachable.<br />
              <span className="text-primary">Stay safe.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Connect without exposing your number
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="px-8 py-4 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/80 backdrop-blur text-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                See How It Works
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>Smart Parking</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl mb-4">How It Works</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />

          {[
            { icon: UserPlus, label: "Sign Up", desc: "Create account" },
            { icon: QrCode, label: "Get QR Sticker", desc: "Receive sticker" },
            { icon: Car, label: "Place on Car", desc: "Display on windshield" },
            { icon: Scan, label: "Scan & Connect", desc: "Instant communication" }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 border border-primary/10 relative z-10">
                  <step.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl mb-2">{step.label}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24 px-6 md:px-12 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl mb-4">When You Need It</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Ban, label: "Blocked Parking" },
              { icon: Lightbulb, label: "Lights Left On" },
              { icon: AlertTriangle, label: "Minor Accident" },
              { icon: Phone, label: "Emergency Contact" },
              { icon: Building, label: "Apartment Parking" },
              { icon: ShoppingBag, label: "Mall Parking" }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all cursor-pointer border border-border/50"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <useCase.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm">{useCase.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Karachi Needs This */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl mb-8">
                A Smarter<br />
                Karachi
              </h2>

              <div className="bg-accent/10 border border-accent/20 rounded-3xl p-8 mb-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-2xl mb-2">Daily parking challenges</p>
                    <p className="text-muted-foreground">Traffic congestion costs time, fuel, and peace of mind</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <p className="text-lg">A step toward digitalization</p>
                </div>
                <div className="flex items-center gap-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <p className="text-lg">Solving real problems</p>
                </div>
                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-primary" />
                  <p className="text-lg">Community-powered solution</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1753697540818-084c98556401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Karachi traffic aerial view"
                className="rounded-3xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revolutionary Idea */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl mb-4">Revolutionary for Karachi</h2>
          </motion.div>

          <div className="relative flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white relative z-10 shadow-2xl"
            >
              <QrCode className="w-20 h-20" />
            </motion.div>

            {[
              { icon: Sparkles, label: "Revolutionary", angle: 0, delay: 0.2 },
              { icon: Activity, label: "Smarter streets", angle: 72, delay: 0.3 },
              { icon: Zap, label: "Digital connection", angle: 144, delay: 0.4 },
              { icon: Users, label: "Community", angle: 216, delay: 0.5 },
              { icon: Shield, label: "Safe & Secure", angle: 288, delay: 0.6 }
            ].map((item, index) => {
              const radius = 200;
              const angleRad = (item.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                  }}
                >
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 flex flex-col items-center gap-2 min-w-[120px]">
                    <item.icon className="w-8 h-8 text-primary" />
                    <p className="text-xs text-center">{item.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety for Loved Ones */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1770732165507-ca1a4c19f31a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Family safety"
                className="rounded-3xl shadow-2xl w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl mb-8">
                Peace of Mind
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-xl mb-2">Stay reachable when it matters</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-xl mb-2">Your family can reach you</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-xl mb-2">Quick notifications for urgent situations</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-24 px-6 md:px-12 bg-secondary/50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-8 relative">
              <PhoneOff className="w-16 h-16 text-white" />
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <h2 className="text-4xl md:text-6xl mb-6">Your Number Stays Private</h2>
            <p className="text-2xl text-muted-foreground mb-8">Contact without exposing your number</p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <Shield className="w-10 h-10 text-primary mb-4 mx-auto" />
                <p>Protected identity</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <PhoneOff className="w-10 h-10 text-primary mb-4 mx-auto" />
                <p>No number sharing</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <Zap className="w-10 h-10 text-primary mb-4 mx-auto" />
                <p>Instant connection</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cooperation / Community */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl mb-6">A Connected City</h2>
            <p className="text-2xl text-muted-foreground mb-16">Small cooperation, big impact</p>

            <div className="relative max-w-4xl mx-auto">
              <img
                src="https://images.unsplash.com/photo-1741171679170-a024eda2d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Connected Karachi"
                className="rounded-3xl shadow-2xl w-full opacity-60"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg"
                    >
                      <Users className="w-6 h-6 text-white" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Slider */}
      <section id="benefits" className="py-24 px-6 md:px-12 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl mb-4">More Than Safety</h2>
            <p className="text-xl text-muted-foreground">Real benefits, real savings</p>
          </motion.div>

          <Slider {...benefitsCarouselSettings} className="benefits-slider">
            {[
              { icon: Droplet, label: "Car Wash", discount: "15% off" },
              { icon: Wrench, label: "Oil Change", discount: "20% off" },
              { icon: Wrench, label: "Maintenance", discount: "10% off" },
              { icon: Sparkles, label: "Detailing", discount: "15% off" },
              { icon: Coffee, label: "Restaurants", discount: "10% off" },
              { icon: Coffee, label: "Cafés", discount: "15% off" },
              { icon: Activity, label: "Padel Courts", discount: "20% off" },
              { icon: Activity, label: "Cricket Clubs", discount: "15% off" },
              { icon: Activity, label: "Football Clubs", discount: "10% off" }
            ].map((benefit, index) => (
              <div key={index} className="px-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-card rounded-3xl p-8 shadow-lg border border-border/50 h-64 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <benefit.icon className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-xl mb-2">{benefit.label}</h3>
                  <div className="px-4 py-2 bg-accent/10 rounded-full">
                    <p className="text-accent">{benefit.discount}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-7xl mb-8">Join Safe Safar Today</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90">Be part of the solution. Make Karachi smarter.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="px-10 py-5 bg-white text-primary rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow flex items-center justify-center gap-2"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white/10 backdrop-blur text-white rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Contact Support
                <Phone className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Slider Styles */}
      <style>{`
        .benefits-slider .slick-dots {
          bottom: -40px;
        }
        .benefits-slider .slick-dots li button:before {
          color: #7e7e7e;
          font-size: 10px;
        }
        .benefits-slider .slick-dots li.slick-active button:before {
          color: #22c55e;
        }
        .benefits-slider .slick-prev,
        .benefits-slider .slick-next {
          z-index: 1;
        }
        .benefits-slider .slick-prev {
          left: -40px;
        }
        .benefits-slider .slick-next {
          right: -40px;
        }
        .benefits-slider .slick-prev:before,
        .benefits-slider .slick-next:before {
          color: #7e7e7e;
          font-size: 30px;
        }
        @media (max-width: 768px) {
          .benefits-slider .slick-prev {
            left: -20px;
          }
          .benefits-slider .slick-next {
            right: -20px;
          }
        }
      `}</style>
    </div>
  );
}
