"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import {
  Menu,
  X,
  Phone,
  Mail,
  CheckCircle2,
  Code,
  Globe,
  Layout,
  Smartphone,
  ShieldCheck,
  Search,
  PenTool,
  Rocket,
  ArrowRight,
  Star,
  Zap,
  Award,
  Clock,
  Building2,
  Users,
  TrendingUp,
  ChevronDown,
  MessageSquare,
  Cpu,
  BadgeCheck,
  CalendarCheck,
  Languages,
  Copy,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import BrandsClients from "@/components/BrandsClients";
import ThemeToggle from "@/components/ThemeToggle";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid corporate email"),
  mobile: z.string().min(8, "Please enter a valid mobile number"),
  service: z.string().min(1, "Please select a service"),
  brief: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
const CONTACT_EMAIL = "contact@webdesignerindubai.ae";

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-card hover:bg-card/80 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${index}`}
      >
        <span className="font-semibold text-foreground text-sm md:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1 bg-card/60 text-muted-foreground text-sm leading-relaxed border-t border-border/50">
          {a}
        </div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setIsEmailCopied(true);
      toast({
        title: "Email copied",
        description: CONTACT_EMAIL,
      });
      window.setTimeout(() => setIsEmailCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        title: "Could not copy email",
        description: `Please copy ${CONTACT_EMAIL} manually.`,
      });
    }
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      service: "",
      brief: "",
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    if (!FORMSPREE_ID) {
      toast({
        title: "Configuration Error",
        description: "The enquiry form is temporarily unavailable. Please email us directly instead.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New website enquiry from ${data.name}`,
          _replyto: data.email,
          _format: "plain",
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          service: data.service,
          brief: data.brief || "No project brief provided.",
        }),
        signal: controller.signal,
      });

      const responseBody = await response.json().catch(() => null) as {
        errors?: Array<{ message?: string }> | string;
        message?: string;
      } | null;

      if (response.ok) {
        toast({
          title: "Message Sent Successfully",
          description: "Thank you for reaching out. Your enquiry is on its way and I'll get back to you within 2 hours.",
        });
        form.reset();
      } else {
        const errorMsg = Array.isArray(responseBody?.errors)
          ? responseBody.errors
              .map((error) => error.message)
              .filter(Boolean)
              .join(", ")
          : typeof responseBody?.errors === "string"
            ? responseBody.errors
            : responseBody?.message;

        toast({
          title: "Submission Failed",
          description: errorMsg || "Something went wrong. Please try again or email us directly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: error instanceof DOMException && error.name === "AbortError"
          ? "Request Timed Out"
          : "Network Error",
        description: `Could not send your message. Please try again or email ${CONTACT_EMAIL} directly.`,
        variant: "destructive",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#brands", label: "Brands" },
    { href: "#about", label: "About" },
    { href: "#process", label: "Process" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Grain texture overlay — premium depth */}
      <div className="grain-overlay" aria-hidden="true" />
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="site-logo text-sm sm:text-xl lg:text-2xl whitespace-nowrap text-foreground">
            Web Designer in Dubai
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium tracking-wide text-muted-foreground hover:text-primary transition-colors"
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-ring"
              onClick={() => window.open("https://wa.me/971566530065", "_blank")}
              data-testid="btn-get-quote-header"
            >
              Get a Free Quote
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="btn-mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg">
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="w-full mt-4 bg-primary text-primary-foreground"
                onClick={() => window.open("https://wa.me/971566530065", "_blank")}
              >
                Get a Free Quote
              </Button>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col justify-center min-h-[90vh]">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(226,241,99,0.08),transparent)]"></div>
          {/* Animated mesh glows */}
          <div className="hero-mesh-1"></div>
          <div className="hero-mesh-2"></div>
          <div 
            className="absolute inset-0 opacity-[0.035]" 
            style={{ backgroundImage: 'radial-gradient(rgba(226,241,99,0.8) 1px, transparent 1px)', backgroundSize: '44px 44px' }}
          ></div>
          {/* Animated floating rings */}
          <div className="hero-ring hero-ring-1"></div>
          <div className="hero-ring hero-ring-2"></div>
          <div className="hero-ring hero-ring-3"></div>
          {/* Floating gold particles */}
          {[
            { left: "15%", bottom: "20%", delay: "0s",   dur: "7s"  },
            { left: "35%", bottom: "10%", delay: "1.5s", dur: "9s"  },
            { left: "55%", bottom: "30%", delay: "3s",   dur: "6s"  },
            { left: "70%", bottom: "15%", delay: "0.8s", dur: "11s" },
            { left: "85%", bottom: "25%", delay: "4s",   dur: "8s"  },
            { left: "25%", bottom: "5%",  delay: "2.5s", dur: "10s" },
          ].map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{ left: p.left, bottom: p.bottom, animationDelay: p.delay, animationDuration: p.dur }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
              <span className="text-sm font-medium text-primary">Available for New Projects · Dubai-Based · Responds in Under 2 Hours</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-foreground leading-tight mb-6"
            >
              Professional Web Design &amp; Website Development in Dubai
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              Transform your online presence with enterprize-grade web design and development. Tailored for Dubai-based companies seeking faster site speeds, higher Google search visibility, and predictable lead generation. Crafting high-performance websites built for today's digital standards.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                size="lg"
                className="btn-shimmer w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 px-8 text-lg animate-pulse-ring flex items-center gap-2"
                onClick={() => window.open("https://wa.me/971566530065", "_blank")}
                data-testid="btn-hero-primary"
              >
                <Phone size={20} />
                <FaWhatsapp size={22} />
                Call / WhatsApp: 0566530065
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg font-medium border-primary/50 text-foreground hover:bg-primary/10"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="btn-hero-secondary"
              >
                Request a Free Consultation
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/50"
            >
              {[
                { icon: <ShieldCheck size={20} />, text: "14+ Years Experience" },
                { icon: <Clock size={20} />, text: "Delivered in 1–4 Weeks" },
                { icon: <Languages size={20} />, text: "English & Arabic Sites" },
                { icon: <BadgeCheck size={20} />, text: "Google 95+ PageSpeed" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span className="text-primary">{b.icon}</span>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center sm:text-left">{b.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="flex flex-col items-center mt-14 gap-1"
          >
            <span className="text-xs text-muted-foreground tracking-widest uppercase">scroll</span>
            <ChevronDown size={18} className="text-primary/40 scroll-indicator" />
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <div className="relative py-10 border-y border-border/40 bg-card/30 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
        <div className="marquee-track">
          {["Next.js", "React", "TypeScript", "WordPress", "Figma", "HTML5 / CSS3", "Tailwind CSS", "Node.js", "Headless CMS", "Core Web Vitals", "SEO Architecture", "Vercel", "GSAP", "REST APIs", "Next.js", "React", "TypeScript", "WordPress", "Figma", "HTML5 / CSS3", "Tailwind CSS", "Node.js", "Headless CMS", "Core Web Vitals", "SEO Architecture", "Vercel", "GSAP", "REST APIs"].map((tech, i) => (
            <span key={i} className="marquee-item">
              <Zap size={14} className="text-primary inline-block mr-2 flex-shrink-0" />
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-24 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                <Star size={14} /> What I Deliver
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-foreground mb-6">
                Custom Website Design for Dubai Businesses
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </motion.div>
          </div>

          {/* Pricing Tier Cards — 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-5">
            {[
              {
                icon: <Globe className="w-7 h-7 text-primary" />,
                tier: "Standard",
                price: "AED 1,500",
                tagline: "Best for growing companies",
                delivery: "7–14 Day Delivery",
                pages: "5–7 Pages",
                features: ["Services, About & Contact pages","Premium Layout & Design","Advanced Lead Forms","Speed Optimization"],
                badges: ["Custom Design","Lead Forms","Speed Optimized","English/Arabic"],
                highlight: true,
              },
              {
                icon: <Code className="w-7 h-7 text-primary" />,
                tier: "Basic",
                price: "AED 800",
                tagline: "Best for new businesses & startups",
                delivery: "7-Day Delivery",
                pages: "3–4 Pages",
                features: ["Home, Service & Contact pages","Mobile Responsive Design","Contact Form & WhatsApp Button","Basic SEO Setup"],
                badges: ["HTML5/CSS3","Mobile-First","Contact Form","Basic SEO"],
              },
              {
                icon: <Layout className="w-7 h-7 text-primary" />,
                tier: "Premium",
                price: "AED 2,500–3,000",
                tagline: "Complete corporate website",
                delivery: "14–20 Day Delivery",
                pages: "8–12 Pages",
                features: ["Full Custom Design & Brand Consistency","Blog / Articles Section","Advanced SEO Setup","Priority Support"],
                badges: ["Full Custom Design","Blog / Articles","Advanced SEO","Brand Consistency"],
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`service-card group relative ${s.highlight ? "pricing-card-selected" : ""}`}
              >
                {s.highlight && (
                  <div className="pricing-popular-badge-wrapper">
                    <span className="pricing-popular-badge">Most Popular</span>
                  </div>
                )}
                <div className="service-card-glow"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="service-icon-wrap">{s.icon}</div>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-card border border-border rounded-full px-2.5 py-1 flex items-center gap-1">
                      <Clock size={10} /> {s.delivery}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="text-xs font-semibold tracking-widest uppercase text-primary">{s.tier} · {s.pages}</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{s.price}</div>
                  <p className="text-xs text-muted-foreground mb-5">{s.tagline}</p>
                  <ul className="space-y-2 mb-6">
                    {s.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BadgeCheck size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {s.badges.map((b, bi) => <Badge key={bi} variant="secondary" className="tag-badge">{b}</Badge>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* E-commerce development — full-width highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="service-card group border-primary/40 bg-gradient-to-r from-card via-primary/5 to-card"
          >
            <div className="service-card-glow"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="service-icon-wrap">
                    <Cpu className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">E-Commerce · Custom Quote</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">E-Commerce Development in UAE</h2>
                <p className="text-muted-foreground leading-relaxed">Launch a fast, secure online store tailored to UAE customers, with mobile-first product discovery, trusted payment integrations, and an easy path from browsing to checkout.</p>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-3 min-w-[220px]">
                <ul className="space-y-2">
                  {["Shopify, WooCommerce or Custom Storefront","UAE Payment Gateway Integration","Mobile-First Product Pages","English & Arabic RTL Support","SEO-Ready Store Architecture"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BadgeCheck size={14} className="text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  className="btn-shimmer mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2"
                  onClick={() => window.open("https://wa.me/971566530065", "_blank")}
                >
                  <FaWhatsapp size={14} /> Discuss Your Project
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Specialist Over Agency */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                <TrendingUp size={14} /> The Smart Choice
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-foreground mb-6">
                Why Hire a Local Web Designer in Dubai
              </h2>
              <p className="text-muted-foreground text-lg">Skip long agency sign-off cycles and middleman communication. Work directly with a senior specialist to build high-performance websites engineered for business growth.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Users size={28} />,
                title: "Agency",
                subtitle: "Large team, many accounts",
                points: [
                  "Account manager between you and the dev",
                  "Multiple team members with less direct access to the actual developer",
                  "Template-first, billed as 'custom'",
                  "Longer delivery timelines",
                  "Difficult to reach once signed",
                  "High agency fees to cover overhead and sales teams",
                ],
                highlight: false,
                cta: null,
              },
              {
                icon: <Building2 size={28} />,
                title: "Generic Freelancer",
                subtitle: "Low price, high risk",
                points: [
                  "Limited tech stack depth",
                  "Page builders & cheap themes",
                  "Poor post-launch support",
                  "No SEO or CRO expertise",
                  "Inconsistent availability",
                  "Unclear post-launch support guarantees",
                ],
                highlight: false,
                cta: null,
              },
              {
                icon: <BadgeCheck size={28} />,
                title: "Gagan Dutta",
                subtitle: "Senior specialist, direct access",
                points: [
                  "You work directly with me — no middlemen",
                  "14+ years of hands-on digital production experience",
                  "Custom Next.js, WordPress, and web builds engineered for performance",
                  "1–3 week delivery on most projects",
                  "WhatsApp-direct, same-day responses",
                  "Agency quality at freelancer efficiency",
                ],
                highlight: true,
                cta: "Work With Me",
              },
            ].map((col, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl p-8 border ${col.highlight ? "bg-primary/5 border-primary/40 relative" : "bg-card border-border"}`}
              >
                {col.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${col.highlight ? "bg-primary/20 text-primary" : "bg-card text-muted-foreground"}`}>
                  {col.icon}
                </div>
                <h3 className="text-xl font-bold mb-1 text-foreground">{col.title}</h3>
                <p className="text-xs text-muted-foreground mb-6">{col.subtitle}</p>
                <ul className="space-y-3">
                  {col.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 ${col.highlight ? "text-primary" : "text-muted-foreground/50"}`}>
                        {col.highlight ? <CheckCircle2 size={16} /> : <span className="text-lg leading-none">—</span>}
                      </span>
                      <span className={col.highlight ? "text-foreground" : "text-muted-foreground"}>{p}</span>
                    </li>
                  ))}
                </ul>
                {col.cta && (
                  <Button
                    className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="btn-why-cta"
                  >
                    {col.cta} <ArrowRight size={16} className="ml-1" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {/* AI-Enhanced workflow strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Cpu size={28} className="text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground mb-2">AI-Accelerated Development — Faster Delivery, Same Precision</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">84% of senior developers now integrate AI tooling into their workflow (Stack Overflow 2025). I leverage AI-assisted code generation and testing to cut delivery times by up to 40% — without compromising on code quality, accessibility, or architecture integrity. You get faster launches and more time to focus on your business.</p>
            </div>
            <Button
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 flex-shrink-0"
              onClick={() => window.open("https://wa.me/971566530065", "_blank")}
              data-testid="btn-ai-cta"
            >
              <FaWhatsapp size={16} className="mr-2" /> Ask Me About It
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/40 border-y border-border/40">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                <MessageSquare size={14} /> Client Feedback
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-4">Trusted by Dubai Businesses</h2>
              <div className="w-16 h-1 bg-primary mx-auto"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Gagan delivered our corporate site in under 3 weeks — it loads in under 1.5 seconds and we started getting inbound enquiries within days of going live. The quality is indistinguishable from what a top agency would produce, at a fraction of the cost.",
                name: "Operations Director",
                company: "Premium Retail Brand, Dubai",
                stars: 5,
              },
              {
                quote: "We needed a bilingual English/Arabic WordPress site that met TDRA compliance standards. Gagan handled it seamlessly, including the RTL layout, and our site now ranks on page 1 for three of our target keywords. Direct communication throughout — no account managers, no delays.",
                name: "Marketing Manager",
                company: "Healthcare Group, UAE",
                stars: 5,
              },
              {
                quote: "After working with two agencies who missed deadlines and delivered generic templates, Gagan was a breath of fresh air. The Next.js architecture he built for our microsite campaign hit 98 on PageSpeed and our conversion rate improved noticeably. Highly recommend.",
                name: "Head of Digital",
                company: "Hospitality Group, Dubai",
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glow-card bg-card border border-border rounded-2xl p-8 flex flex-col overflow-hidden"
              >
                <div className="quote-mark">"</div>
                <div className="flex gap-1 mb-5 relative z-10">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 italic relative z-10">"{t.quote}"</p>
                <div className="border-t border-border/50 pt-5">
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BrandsClients />

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                <Award size={14} /> The Specialist
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-foreground mb-8">
                The Mind Behind the Design & Code
              </h2>
              <div className="w-20 h-1 bg-primary mb-8"></div>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                As a seasoned UI/UX Designer and Web Developer based in Dubai, I specialize in architecting complex digital products that are as functional as they are visually striking. My approach is deeply rooted in user-centered research, clean semantic code, and cutting-edge web frameworks like React and Next.js.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Over 14 Years of Professional Global & Regional Market Experience.",
                  "Deep execution experience delivering corporate websites, high-performance microsites, and custom web setups across diverse sectors including Corporate, Premium Retail, Hospitality, and Healthcare.",
                  "Impacted digital touchpoints for world-class global retail brands (Calvin Klein, Tommy Hilfiger, Skechers, Tim Hortons) and local market leaders like Bond Interiors & Al Sharq Healthcare.",
                  "Holder of advanced professional certifications in Accessibility, Figma-to-CSS Implementation, and Interaction Design Foundations."
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-8 flex items-center gap-2"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="btn-about-cta"
              >
                Start a Conversation <ArrowRight size={18} />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="min-w-0 space-y-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "14+", label: "Years Experience" },
                  { num: "50+", label: "Enterprize Projects" },
                  { num: "100%", label: "Client Satisfaction" }
                ].map((stat, i) => (
                  <div key={i} className="stat-card">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.num}</div>
                    <div className="text-xs md:text-sm text-muted-foreground leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Brand logos marquee */}
              <div className="brands-wrap">
                <p className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-5 font-semibold">Brands I've Worked With</p>
                <div className="relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-card to-transparent pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-card to-transparent pointer-events-none"></div>
                  <div className="marquee-track-slow">
                    {["Calvin Klein", "Tommy Hilfiger", "Skechers", "Tim Hortons", "Bond Interiors", "Al Sharq Healthcare", "Calvin Klein", "Tommy Hilfiger", "Skechers", "Tim Hortons", "Bond Interiors", "Al Sharq Healthcare"].map((brand, i) => (
                      <span key={i} className="brand-chip">{brand}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certification badges */}
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {["Web Accessibility (WCAG)", "Figma Design Systems", "Core Web Vitals & Speed", "UX Research & Strategy", "Interaction Design"].map((cert, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                      <Star size={10} /> {cert}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-foreground mb-6">
              A Proven, Lead-Driven Web Development Process
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[45px] left-0 w-full h-[2px] bg-border/50 z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
              {[
                {
                  step: "01",
                  icon: <Search size={28} />,
                  title: "Discovery & Strategy",
                  desc: "Deep dive into your corporate business model, regional competitors, and target audience search intent."
                },
                {
                  step: "02",
                  icon: <PenTool size={28} />,
                  title: "Ideation & UI/UX Design",
                  desc: "Crafting high-conversion, pixel-perfect layouts using advanced Figma frameworks."
                },
                {
                  step: "03",
                  icon: <Code size={28} />,
                  title: "Clean-Code Development",
                  desc: "Translating approved designs into lightning-fast Next.js apps, corporate microsites, custom WordPress themes, or raw HTML code."
                },
                {
                  step: "04",
                  icon: <CheckCircle2 size={28} />,
                  title: "SEO Optimization & Testing",
                  desc: "Full On-Page SEO alignment, Core Web Vitals tuning, and strict cross-browser quality assurance."
                },
                {
                  step: "05",
                  icon: <Rocket size={28} />,
                  title: "Launch & Optimization",
                  desc: "Going live with zero downtime and establishing structural foundations for continuous inbound lead generation."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                    <div className="text-primary">{item.icon}</div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 px-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background border-t border-border/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                <ChevronDown size={14} /> Common Questions
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground">Frequently Asked Questions</h2>
            </motion.div>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "How long does a website project typically take?",
                a: "Most projects are delivered in 1–4 weeks from design approval. A standard corporate WordPress site takes around 2–3 weeks. I'll give you an accurate timeline at the start — and I stick to it."
              },
              {
                q: "Do you build bilingual English and Arabic websites?",
                a: "Yes — bilingual EN/AR development is a standard offering, including full RTL (right-to-left) layout support for Arabic content. This is particularly in demand for corporate, healthcare, and retail brands in the UAE market."
              },
              {
                q: "What is included after launch?",
                a: "Every project includes 30 days of post-launch support at no extra charge — covering bug fixes, minor adjustments, and browser/device testing. Ongoing retainer packages for content updates, performance monitoring, and SEO maintenance are available separately."
              },
              {
                q: "What is the starting price for a website?",
                a: "Packages start from AED 800 (Basic — 3–4 pages, 7-day delivery), AED 1,500 (Standard — 5–7 pages, premium layout), and AED 2,500–3,000 (Premium — 8–12 pages, full custom design, advanced SEO). Next.js enterprize builds start from AED 3,000. All projects are scoped individually — send me a brief and I'll respond with a transparent, itemised quote within 24 hours."
              },
              {
                q: "I already have a website — can you improve it?",
                a: "Absolutely. Website audits, performance overhauls, UI/UX revamps, and CRO (conversion rate optimisation) work are all available. I'll audit your current site, identify the highest-impact fixes, and propose a targeted improvement plan."
              },
              {
                q: "Can you help with Google ranking / SEO?",
                a: "On-page SEO is built into every project by default — semantic HTML structure, Core Web Vitals optimisation, schema markup, meta data, and canonical configuration. For ongoing link-building or content SEO strategy, I partner with specialist SEO consultants and can coordinate that as part of your project."
              },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-card/30 border-t border-border/40">
        <div className="container mx-auto px-6">
          {/* Urgency bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/10 border border-primary/30 rounded-2xl p-5 mb-16 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <CalendarCheck size={22} className="text-primary flex-shrink-0" />
              <p className="text-sm font-medium text-foreground">Currently accepting new project enquiries for <span className="text-primary font-semibold">Q3 2026</span> — limited availability.</p>
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-shrink-0 flex items-center gap-2"
              onClick={() => window.open("https://wa.me/971566530065", "_blank")}
              data-testid="btn-urgency-whatsapp"
            >
              <FaWhatsapp size={14} /> Reserve Your Slot
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-foreground mb-6">
                Let's Build Something Exceptional
              </h2>
              <div className="w-20 h-1 bg-primary mb-8"></div>
              <p className="text-lg text-muted-foreground mb-12">
                Fill in the form and I'll respond within 2 hours with an honest assessment of your project — scope, timeline, and a transparent quote. No hard sell, no account managers.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-card border-border h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Corporate Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com" type="email" {...field} className="bg-card border-border h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+971 50 000 0000" type="tel" {...field} className="bg-card border-border h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Needed</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-card border-border h-12">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nextjs">Next.js Corporate Website / Microsite</SelectItem>
                            <SelectItem value="wordpress">Custom WordPress Development</SelectItem>
                            <SelectItem value="html">HTML Website Development</SelectItem>
                            <SelectItem value="uiux">UI/UX Revamp</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brief"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Brief (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us briefly about your project goals..." 
                            className="bg-card border-border min-h-[120px] resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-70"
                    data-testid="btn-form-submit"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <div className="bg-card p-10 rounded-2xl border border-border">
                <h3 className="text-2xl font-bold text-foreground mb-8 border-b border-border/50 pb-6">Direct Contact</h3>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <a href={`mailto:${CONTACT_EMAIL}`} className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6 group">
                      <div className="w-16 h-16 flex-shrink-0 rounded-full bg-background border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Mail size={28} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-muted-foreground mb-1">Email</div>
                        <div className="text-base sm:text-xl font-medium text-foreground break-all group-hover:text-primary transition-colors">{CONTACT_EMAIL}</div>
                      </div>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      aria-label={`Copy ${CONTACT_EMAIL}`}
                      title={isEmailCopied ? "Email copied" : "Copy email address"}
                    >
                      {isEmailCopied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                    </button>
                  </div>

                  <a href="https://wa.me/971566530065" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FaWhatsapp size={32} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Phone / WhatsApp</div>
                      <div className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">+971 56 653 0065</div>
                    </div>
                  </a>
                </div>
                
                <div className="mt-10 p-6 bg-background rounded-xl border border-border flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-muted-foreground font-medium">Typically responds within 2 hours</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-sans font-bold text-foreground">
                Gagan Dutta
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Gagan Dutta Web Design – Freelance Web Designer &amp; Developer in Dubai, UAE
              </p>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © 2026 Gagan Dutta Web Design
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/971566530065"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#25D366] text-[#0B0F17] rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform before:content-[''] before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-[#25D366]/50"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={36} className="relative z-10" />
      </a>
    </div>
  );
}