import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Compass, CalendarRange, Users, Heart, UserRoundPlus,
  Sparkles, Mountain, MapPin, ChevronRight, ChevronDown,
  Hotel, TrainFront, FileText, Shield, Clock, Star, Globe, Phone, Mail
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import usePlannerStore from '../store/plannerStore';
import { cities } from '../data/mockData';

/* ─── hero background images ──────────────────────────────── */
const heroImages = [
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1920',
];

/* ─── reusable scroll-reveal wrapper ────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px', amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.55, delay: inView ? delay : 0, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── "how it works" steps ──────────────────────────────────── */
const steps = [
  { num: '01', icon: Globe, title: 'Choose Your Destination', desc: 'Pick a country, select your travel type, set your trip duration and preferred start date.' },
  { num: '02', icon: MapPin, title: 'Select Regions & Template', desc: 'Choose the regions you want to explore and pick a ready-made itinerary template that fits your style.' },
  { num: '03', icon: FileText, title: 'Get Your Itinerary', desc: 'View your day-by-day plan with inclusions, pricing breakdown and download a PDF instantly.' },
];

/* ─── stats ─────────────────────────────────────────────────── */
const stats = [
  { value: '10+', label: 'Countries', icon: Globe },
  { value: '50+', label: 'Day Tours', icon: Sparkles },
  { value: '20+', label: 'Regions', icon: Mountain },
  { value: '100+', label: 'Templates', icon: FileText },
];

/* ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const store = usePlannerStore();
  const [bgIdx, setBgIdx] = useState(0);

  /* cycle hero bg */
  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  const startFlow = () => navigate('/planner/wizard');

  /* smooth scroll to "how it works" */
  const howRef = useRef(null);
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-canvas dark:bg-ink font-sans transition-colors duration-300">
      <Navbar />

      {/* ══════════ HERO — full viewport ══════════ */}
      <section className="relative h-screen min-h-[600px] flex flex-col overflow-hidden">
        {/* bg images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIdx}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="absolute inset-0 z-0"
          >
            <img src={heroImages[bgIdx]} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/50 via-ink/30 to-ink/70" />

        {/* hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] backdrop-blur-2xl text-white/90 font-semibold text-sm tracking-wide mb-6 border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.2)]"
          >
            <Compass className="w-4 h-4" /> Personalized Tour Planning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
          >
            Design Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-200 to-indigo-300">
              Dream Adventure
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg text-white/70 font-medium max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Build a day-by-day itinerary for your perfect trip.
            Choose your destination, pick a template — and get an instant plan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex items-center justify-center"
          >
            <button
              onClick={startFlow}
              className="group relative flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-5px_rgba(79,70,229,0.4)] border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-brand to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] mix-blend-overlay transition-opacity duration-500" />
              <Sparkles className="relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 tracking-wide">Start Planning</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.button
          onClick={scrollToHow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          <span className="text-xs font-semibold tracking-widest uppercase">Explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section ref={howRef} className="relative py-24 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-canvas via-white to-canvas dark:from-ink dark:via-[#111827] dark:to-ink overflow-hidden transition-colors duration-300">
        {/* bg glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[160px] pointer-events-none" />

        <Reveal className="text-center mb-16">
          <span className="inline-block text-brand font-bold text-sm tracking-widest uppercase mb-3">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink dark:text-white tracking-tight">
            Plan in 3 easy steps
          </h2>
        </Reveal>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.15} className="relative">
              <div className="rounded-3xl p-8 h-full hover:border-brand/30 hover:-translate-y-1 transition-all duration-300 group bg-white dark:bg-white/[0.06] backdrop-blur-2xl border border-gray-200 dark:border-white/[0.12] shadow-lg dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:bg-white/[0.1] dark:hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.35)]">
                <span className="text-5xl font-black text-brand/15 dark:text-brand/20 group-hover:text-brand/30 dark:group-hover:text-brand/40 transition-colors absolute top-6 right-6">{s.num}</span>
                <div className="w-14 h-14 rounded-2xl bg-brand/10 dark:bg-white/[0.08] backdrop-blur-md border border-brand/15 dark:border-white/10 flex items-center justify-center text-brand mb-6">
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-ink dark:text-white mb-2">{s.title}</h3>
                <p className="text-ink/50 dark:text-white/55 font-medium text-sm leading-relaxed">{s.desc}</p>
              </div>
              {/* connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-ink/10 dark:border-white/15" />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ DESTINATIONS ══════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-canvas dark:bg-ink overflow-hidden transition-colors duration-300">
        <Reveal className="text-center mb-16">
          <span className="inline-block text-brand font-bold text-sm tracking-widest uppercase mb-3">Destinations</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink dark:text-white tracking-tight">
            Popular Destinations
          </h2>
          <p className="text-ink/40 dark:text-white/50 mt-4 max-w-lg mx-auto font-medium">
            Explore stunning destinations with curated day tours & itinerary templates.
          </p>
        </Reveal>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <Reveal key={city.id} delay={i * 0.08}>
              <div className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer shadow-lg" onClick={startFlow}>
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-ink/90 via-black/20 dark:via-ink/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-extrabold text-white mb-1">{city.name}</h3>
                  <p className="text-white/60 text-sm font-medium line-clamp-2">{city.description}</p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/[0.15] dark:bg-white/[0.08] backdrop-blur-xl border border-white/20 dark:border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-canvas via-white to-canvas dark:from-ink dark:via-[#111827] dark:to-ink transition-colors duration-300">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand/10 dark:bg-white/[0.08] backdrop-blur-xl border border-brand/15 dark:border-white/10 shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] mx-auto flex items-center justify-center text-brand mb-4">
                <s.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-ink dark:text-white mb-1">{s.value}</div>
              <div className="text-ink/40 dark:text-white/50 font-semibold text-sm uppercase tracking-wider">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURES STRIP ══════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-canvas dark:bg-ink overflow-hidden transition-colors duration-300">
        <Reveal className="text-center mb-16">
          <span className="inline-block text-brand font-bold text-sm tracking-widest uppercase mb-3">Why DigiWave</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink dark:text-white tracking-tight">
            Everything you need
          </h2>
        </Reveal>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Transparent Pricing', desc: 'Clear cost breakdown for every day — no hidden charges.' },
            { icon: Clock, title: 'Instant Itinerary', desc: 'Get a complete day-by-day plan ready in minutes.' },
            { icon: FileText, title: 'PDF Download', desc: 'Download a professional PDF itinerary to share or print.' },
            { icon: Star, title: 'Curated Templates', desc: 'Choose from ready-made itinerary templates for every style.' },
            { icon: TrainFront, title: 'Inclusions & Exclusions', desc: "Know exactly what's included and what's not in your plan." },
            { icon: Globe, title: 'Multi-country Planning', desc: 'Pick any country, select regions and plan your perfect trip.' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="rounded-3xl p-7 h-full hover:border-brand/30 hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-white/[0.06] backdrop-blur-2xl border border-gray-200 dark:border-white/[0.12] shadow-lg dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:bg-white/[0.1] dark:hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.35)]">
                <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-white/[0.08] backdrop-blur-md border border-brand/15 dark:border-white/10 flex items-center justify-center text-brand mb-5">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ink dark:text-white mb-2">{f.title}</h3>
                <p className="text-ink/50 dark:text-white/50 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImages[1]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/15 rounded-full blur-[200px] pointer-events-none" />

        <Reveal className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Ready to plan your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-200 to-indigo-300">dream trip?</span>
          </h2>
          <p className="text-white/70 font-medium mb-10 text-lg">
            Join travellers who built their perfect itinerary with DigiWave.
          </p>
          <button
            onClick={startFlow}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-5px_rgba(79,70,229,0.4)] border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-brand to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] mix-blend-overlay transition-opacity duration-500" />
            <Sparkles className="relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10 tracking-wide">Start Planning Now</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </Reveal>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-gray-100 dark:bg-[#0a0f1a] border-t border-gray-200 dark:border-white/5 py-14 px-4 sm:px-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-sm">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-ink dark:text-white font-extrabold text-lg tracking-tight">DigiWave</span>
            </div>
            <p className="text-ink/40 dark:text-white/40 text-sm font-medium leading-relaxed">
              Tour Planning Management System. Build, customize & share your perfect itinerary.
            </p>
          </div>

          {/* quick links */}
          <div>
            <h4 className="text-ink dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Plan Trip', href: '/planner/wizard' },
                { label: 'My Plans', href: '/history' },
                { label: 'Admin Panel', href: '/admin' },
              ].map(l => (
                <li key={l.label}>
                  <button onClick={() => navigate(l.href)} className="text-ink/40 dark:text-white/50 hover:text-brand dark:hover:text-white text-sm font-medium transition-colors cursor-pointer">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* destinations */}
          <div>
            <h4 className="text-ink dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Featured Places</h4>
            <ul className="space-y-2.5">
              {cities.slice(0, 5).map(c => (
                <li key={c.id} className="text-ink/40 dark:text-white/50 text-sm font-medium">{c.name}</li>
              ))}
              <li className="text-brand text-sm font-semibold">+ more</li>
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-ink dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-ink/40 dark:text-white/50 text-sm font-medium">
                <Mail className="w-4 h-4 text-brand shrink-0" /> hello@digiwave.ch
              </li>
              <li className="flex items-center gap-2 text-ink/40 dark:text-white/50 text-sm font-medium">
                <Phone className="w-4 h-4 text-brand shrink-0" /> +41 44 123 45 67
              </li>
              <li className="flex items-center gap-2 text-ink/40 dark:text-white/50 text-sm font-medium">
                <MapPin className="w-4 h-4 text-brand shrink-0" /> Zurich, Switzerland
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ink/25 dark:text-white/30 text-xs font-medium">&copy; 2026 DigiWave Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-ink/25 dark:text-white/30 text-xs font-medium hover:text-ink/50 dark:hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-ink/25 dark:text-white/30 text-xs font-medium hover:text-ink/50 dark:hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>


    </div>
  );
}
