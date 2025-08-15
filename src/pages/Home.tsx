import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

function TemplateIcon({ name }: { name: string }) {
  switch (name) {
    case "rocket":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "bars":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m8 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h2a2 2 0 002-2" />
        </svg>
      );
    case "user":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case "cart":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4m-8 2a2 2 0 11-4 0 2 2 0 014 0" />
        </svg>
      );
    case "bulb":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    default: // trend
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
  }
}
function StepMock({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={styles.mockWindow}>
      {/* window header dots */}
      <div className="flex gap-2 mb-3">
        <span className={`${styles.dot} bg-[#FF2E63]`} />
        <span className={`${styles.dot} bg-[#F9F871]`} />
        <span className={`${styles.dot} bg-[#00E5FF]`} />
      </div>

      {/* body (changes per variant) */}
      {variant === 1 && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className={`${styles.skel} w-1/4 h-8 bg-[#6C5CE7]/30 rounded`} />
            <div className={`${styles.skel} w-3/4 h-8 bg-[#6C5CE7]/10 rounded`} />
          </div>
          <div className="flex gap-2">
            <div className={`${styles.skel} w-1/2 h-6 bg-[#00E5FF]/10 rounded`} />
            <div className={`${styles.skel} w-1/4 h-6 bg-[#00E5FF]/10 rounded`} />
            <div className={`${styles.skel} w-1/4 h-6 bg-[#00E5FF]/10 rounded`} />
          </div>
          <div className="flex gap-2">
            <div className={`${styles.skel} w-1/3 h-6 bg-[#FF2E63]/10 rounded`} />
            <div className={`${styles.skel} w-1/3 h-6 bg-[#FF2E63]/10 rounded`} />
            <div className={`${styles.skel} w-1/3 h-6 bg-[#FF2E63]/10 rounded`} />
          </div>
          <div className="w-full h-20 rounded bg-[#0A0F1F] border border-[#6C5CE7]/20" />
        </div>
      )}

      {variant === 2 && (
        <div className="space-y-3">
          <div className={`${styles.skel} w-full h-8 rounded bg-[#6C5CE7]/10`} />
          <div className="w-full rounded border border-[#6C5CE7]/20 p-3 space-y-2">
            <div className={`${styles.skel} w-full h-4 rounded bg-[#00E5FF]/10`} />
            <div className={`${styles.skel} w-3/4 h-4 rounded bg-[#00E5FF]/10`} />
            <div className={`${styles.skel} w-1/2 h-4 rounded bg-[#00E5FF]/10`} />
          </div>
          <div className="flex gap-2">
            <div className={`${styles.skel} w-28 h-8 rounded-full bg-[#6C5CE7]`} />
            <div className={`${styles.skel} w-28 h-8 rounded bg-transparent border border-[#6C5CE7]/50`} />
          </div>
        </div>
      )}

      {variant === 3 && (
        <div className="space-y-3">
          <div className="rounded border border-[#6C5CE7]/20 p-3 h-32 overflow-hidden">
            <div className={`${styles.skel} w-full h-3 rounded bg-[#6C5CE7]/10 mb-2`} />
            <div className={`${styles.skel} w-3/4 h-3 rounded bg-[#6C5CE7]/10 mb-2`} />
            <div className={`${styles.skel} w-full h-3 rounded bg-[#6C5CE7]/10 mb-2`} />
            <div className={`${styles.skel} w-5/6 h-3 rounded bg-[#6C5CE7]/10 mb-2`} />
            <div className={`${styles.skel} w-full h-3 rounded bg-[#6C5CE7]/10 mb-2`} />
            <div className={`${styles.skel} w-2/3 h-3 rounded bg-[#6C5CE7]/10`} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className={`${styles.chip} w-24 h-8`} />
            <div className={`${styles.chip} w-24 h-8`} />
            <div className={`${styles.chip} w-24 h-8`} />
            <div className={`${styles.chip} w-24 h-8`} />
          </div>
        </div>
      )}
    </div>
  );
}
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060C] to-[#0A0F1F] text-white">
      <Navbar />

      {/* HERO */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Create <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">Platform-Perfect</span> Content in Seconds
            </h1>
            <p className="text-xl text-gray-300 mb-8">
                <strong>CryptAi</strong> writes scripts and posts tailored to each channel—faster than you can say “publish.”
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
                <Link
                to="/auth"
                className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
                aria-label="Start Free - sign up or log in"
                >
                Start Free
                </Link>

                <a
                href="#pricing"
                className="border border-[#6C5CE7] text-white px-6 py-3 rounded-lg hover:bg-[#6C5CE7]/10 transition"
                >
                See Pricing
                </a>
            </div>

            <p className="text-sm text-gray-400">No credit card · 1 Month free generations</p>
            </div>

          {/* Orbiting logos */}
          <div className="lg:w-1/2 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className={`${styles.ring} ${styles.ringPrimary}`}></div>
              <div className={`${styles.ring} ${styles.ringSecondary}`}></div>

              <div className={`${styles.icon} ${styles.iconTop}`}>
                {/* YouTube */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
              <div className={`${styles.icon} ${styles.iconRight}`}>
                {/* Instagram */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#E1306C">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 100 12.325 6.162 6.162 0 000-12.325zM18.406 6.48a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                </svg>
              </div>
              <div className={`${styles.icon} ${styles.iconBottom}`}>
                {/* LinkedIn */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7 19H4V8h3v11zM5.5 6.73A1.73 1.73 0 115.5 3.27a1.73 1.73 0 010 3.46zM20 19h-3v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.74V19h-3V8h2.88v1.37h.04c.4-.75 1.37-1.54 2.82-1.54 3.02 0 3.58 1.99 3.58 4.58V19z"/>
                </svg>
              </div>
              <div className={`${styles.icon} ${styles.iconLeft}`}>
                {/* X */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#1DA1F2">
                  <path d="M18.244 2H21l-6.5 7.444L22 22h-6.9l-4.3-5.56L5.7 22H3l7.09-8.123L2 2h6.9l3.9 5.2L18.244 2Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-12 bg-gradient-to-r from-[#05060C]/50 to-[#0A0F1F]/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 mb-8">Trusted by modern marketers</p>
          <div className="relative overflow-hidden">
            <div className={`${styles.marquee} flex whitespace-nowrap`}>
              <div className="flex items-center space-x-16 pr-16">
                {["TechCo","StartupX","GrowthAgency","DigitalFirst","InnovateLabs","BrandHouse","ScaleUp"].map((n,i)=>(
                  <img key={i} src={`https://via.placeholder.com/120x40/0A0F1F/${i%2? "00E5FF":"6C5CE7"}?text=${encodeURIComponent(n)}`} alt={n} className="h-8 opacity-80"/>
                ))}
              </div>
              <div className="flex items-center space-x-16">
                {["TechCo","StartupX","GrowthAgency","DigitalFirst","InnovateLabs","BrandHouse","ScaleUp"].map((n,i)=>(
                  <img key={`d${i}`} src={`https://via.placeholder.com/120x40/0A0F1F/${i%2? "00E5FF":"6C5CE7"}?text=${encodeURIComponent(n)}`} alt={n} className="h-8 opacity-80"/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From YouTube scripts to LinkedIn posts</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              CriptAi adapts tone, length, and structure for every channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {title:"YT Script Generator", color:"#6C5CE7", desc:"Long-form outline, hook variants, timestamps, and b-roll suggestions tailored for YouTube success."},
              {title:"IG Posts", color:"#FF2E63", desc:"Carousel captions with CTAs, hashtag sets, and engagement hooks designed for Instagram's algorithm."},
              {title:"Reels Scripts", color:"#00E5FF", desc:"30–60s beats, b-roll suggestions, on-screen text, and trending audio recommendations."},
              {title:"Blog Generator", color:"#22D3EE", desc:"SEO outline, tone control, internal link stubs, and meta descriptions optimized for search."},
              {title:"LinkedIn Posts", color:"#0A66C2", desc:"Thought-leadership voice, emoji-lite formatting, and engagement hooks for professional audiences."},
              {title:"X (Twitter) Posts", color:"#1DA1F2", desc:"Threads, hooks, alt-text suggestions, and trending hashtag guardrails for maximum reach."},
            ].map((f)=>(
              <div key={f.title} className={`${styles.glassCard} ${styles.cardHover} p-6 rounded-xl`}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{background:`${f.color}1A`}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{color:f.color}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h12M4 17h8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CriptAi Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Create platform-perfect content in just 3 simple steps.
            </p>
            </div>

            <div className="relative">
            {/* center timeline */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-[#6C5CE7] to-[#00E5FF] -translate-x-1/2" />

            {[
                {
                n: 1,
                title: "Pick Your Channel",
                text:
                    "Select from YouTube, Instagram, LinkedIn, X (Twitter), or Blog. CriptAi automatically adapts to each platform's best practices.",
                swatch: "#6C5CE7",
                },
                {
                n: 2,
                title: "Add Your Topic",
                text:
                    "Describe what you want to create—product launch, thought leadership, or a trending topic. CriptAi understands context.",
                swatch: "#00E5FF",
                },
                {
                n: 3,
                title: "Generate & Edit",
                text:
                    "Get a complete draft instantly. Tweak hooks, adjust tone, or regenerate—then export in your preferred format.",
                swatch: "#FF2E63",
                },
            ].map((s, idx) => (
                <div
                key={s.n}
                className="relative flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0"
                >
                {/* text column */}
                <div
                    className={`${
                    idx % 2 ? "md:pl-16 order-2" : "md:pr-16 order-2 md:order-1"
                    } md:w-1/2`}
                >
                    <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: `${s.swatch}1A` }}
                    >
                    <span className="text-xl font-bold" style={{ color: s.swatch }}>
                        {s.n}
                    </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                    <p className="text-gray-300">{s.text}</p>
                </div>

                {/* visual mock column */}
                <div
                    className={`${
                    idx % 2 ? "order-1" : "order-1 md:order-2"
                    } md:w-1/2`}
                >
                    <div className={`${styles.glassCard} ${styles.cardHover} p-4 rounded-lg`}>
                    <StepMock variant={(idx + 1) as 1 | 2 | 3} />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="py-20 px-6 bg-gradient-to-b from-[#05060C]/50 to-[#0A0F1F]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready-Made Templates</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Jumpstart your content with proven frameworks.</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {["All","YouTube","Instagram","Reels","Blog","LinkedIn","X (Twitter)"].map((t,i)=>(
              <button key={t} className={`px-4 py-2 rounded-full ${i===0 ? "bg-[#6C5CE7] text-white" : "bg-[#6C5CE7]/10 text-white hover:bg-[#6C5CE7]/20 transition"}`}>{t}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {title:"Product Launch", mediaClass: styles.tmLaunch, icon:"rocket", badges:["Instagram","#FF2E63"], desc:"Generate buzz with sequenced announcements across all channels."},
              {title:"Weekly Recap", mediaClass: styles.tmWeekly, icon:"bars", badges:["Reels","#00E5FF"], desc:"Summarize key events and wins in an engaging format."},
              {title:"Founder Story", mediaClass: styles.tmFounder, icon:"user", badges:["LinkedIn","#0A66C2"], desc:"Humanize your brand with authentic storytelling."},
              {title:"Sale Promo", mediaClass: styles.tmSale, icon:"cart", badges:["Instagram","#FF2E63"], desc:"Drive conversions with urgency-building content."},
              {title:"How-To Guide", mediaClass: styles.tmHowto, icon:"bulb", badges:["Blog","#22D3EE"], desc:"Educate your audience with step-by-step tutorials."},
              {title:"Trend Analysis", mediaClass: styles.tmTrend, icon:"trend", badges:["Reels","#22D3EE"], desc:"Position as a thought leader with data-driven insights."},
            ].map((t)=>(
              <div key={t.title} className={`${styles.glassCard} ${styles.cardHover} rounded-xl overflow-hidden`}>
                <div className={`${styles.templateMedia} ${t.mediaClass}`}>
                  <TemplateIcon name={t.icon} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                  <p className="text-gray-300 mb-4">{t.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {/* primary badge */}
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: `${t.badges[1]}1A`, color: t.badges[1] as string }}
                    >
                      {t.badges[0]}
                    </span>
                    {/* secondary badges just for variety */}
                    <span className="text-xs px-2 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7]">YouTube</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2]">X</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#" className="border border-[#6C5CE7] text-white px-6 py-3 rounded-lg hover:bg-[#6C5CE7]/10 transition">
              Browse All Templates
            </a>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Results</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">See how CriptAi transforms content creation.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className={`${styles.glassCard} ${styles.cardHover} rounded-xl p-6 mb-8`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Before CryitAi</h3>
                  <span className="text-sm text-gray-400">Average performance</span>
                </div>
                <div className="bg-[#0A0F1F] rounded-lg p-4 border border-[#FF2E63]/30">
                  <p className="text-gray-300 italic mb-4">
                    “Check out our new feature! It’s really cool and we think you’ll like it. Available now!”
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-sm text-gray-400">Engagement</p><p className="text-xl font-bold text-[#FF2E63]">1.2%</p></div>
                    <div><p className="text-sm text-gray-400">CTR</p><p className="text-xl font-bold text-[#FF2E63]">0.8%</p></div>
                    <div><p className="text-sm text-gray-400">Time</p><p className="text-xl font-bold text-[#FF2E63]">45min</p></div>
                  </div>
                </div>
              </div>

              <div className={`${styles.glassCard} ${styles.cardHover} rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">After CriptAi</h3>
                  <span className="text-sm text-gray-400">Same campaign</span>
                </div>
                <div className="bg-[#0A0F1F] rounded-lg p-4 border border-[#00E5FF]/30">
                  <p className="text-gray-300 italic mb-4">
                    “🚀 Just launched: [Feature Name] solves your #1 frustration with [Problem]. Try it free → [Link] (P.S. Early users get bonus perks!)”
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-sm text-gray-400">Engagement</p><p className="text-xl font-bold text-[#00E5FF]">5.7%</p></div>
                    <div><p className="text-sm text-gray-400">CTR</p><p className="text-xl font-bold text-[#00E5FF]">3.2%</p></div>
                    <div><p className="text-sm text-gray-400">Time</p><p className="text-xl font-bold text-[#00E5FF]">2min</p></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.glassCard} ${styles.cardHover} rounded-xl p-6 h-full`}>
              <h3 className="text-xl font-bold mb-6">Performance Improvements</h3>
              {[
                ["Engagement Rate","+375%",80],
                ["Click-Through Rate","+300%",75],
                ["Content Creation Time","-96%",95],
                ["SEO Ranking","+42%",60],
                ["Consistency","+100%",100],
              ].map(([label,delta,width])=>(
                <div key={label as string} className="mb-6">
                  <div className="flex justify-between mb-2"><span className="font-medium">{label}</span><span className="text-[#00E5FF] font-bold">{delta}</span></div>
                  <div className="w-full bg-[#0A0F1F] rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] h-2.5 rounded-full" style={{width: `${width}%`}} />
                  </div>
                </div>
              ))}
              <div className="mt-8 p-4 bg-[#0A0F1F] rounded-lg border border-[#6C5CE7]/30">
                <p className="text-center text-gray-300 italic">
                  “CriptAi helped us 10x our content output while improving quality. Our engagement rates have never been higher.”
                </p>
                <p className="text-center mt-2 text-[#6C5CE7] font-medium">— Karan Nair., Head of Marketing @GoogleAds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-[#05060C]/50 to-[#0A0F1F]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Start free. Upgrade when you’re growing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {name:"Starter", price:"$0", note:"/mo", cta:"Start Free", highlight:false, perks:["10 generations","All channels","Basic templates","Community support"]},
              {name:"Pro", price:"$19", note:"/mo", cta:"Upgrade to Pro", highlight:true, perks:["Unlimited generations","Advanced templates","Brand voice memory","Priority support"]},
              {name:"Team", price:"$49", note:"/mo", cta:"Contact Sales", highlight:false, perks:["5 seats included","Shared libraries","Export to CMS","SLA support"]},
            ].map((p)=>(
              <div key={p.name} className={`${styles.glassCard} ${styles.cardHover} rounded-2xl p-6 border ${p.highlight ? "border-[#6C5CE7]/60" : "border-white/10"}`}>
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-gray-400 ml-1">{p.note}</span>
                </div>
                <ul className="mt-6 space-y-2 text-gray-300">
                  {p.perks.map(item=>(
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={p.name==="Starter" ? "/app" : "#"}
                  className={`mt-6 inline-block w-full text-center px-4 py-2 rounded-lg ${p.highlight ? "bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF]" : "bg-white/10 hover:bg-white/20"} text-white`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">Everything you need to know before you start.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["Do I need a credit card to start?", "No. The Starter plan includes 1 Month Free generations—no card required."],
              ["What platforms do you support?", "YouTube, Instagram (posts & reels), LinkedIn, X (Twitter), and Blogs."],
              ["Can I use my brand voice?", "Yes on Pro+ — add tone guidelines and examples; we’ll mirror your voice."],
              ["Do you store my prompts?", "We store minimal metadata to run the product; you can delete data anytime."],
              ["How do teams work?", "Invite teammates, share templates, and manage brand assets on the Team plan."],
              ["Can I cancel anytime?", "Absolutely. Your plan will remain active until your current cycle ends."]
            ].map(([q,a])=>(
              <div key={q} className={`${styles.glassCard} ${styles.cardHover} rounded-xl p-5`}>
                <h3 className="font-semibold mb-2">{q}</h3>
                <p className="text-gray-300">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-6">
        <div className={`${styles.glassCard} ${styles.cardHover} max-w-6xl mx-auto rounded-2xl p-10 text-center`}>
          <h3 className="text-2xl md:text-3xl font-bold">
            Ready to create platform-perfect content?
          </h3>
          <p className="text-gray-300 mt-2">Join free today. Upgrade only when you need more.</p>
          <div className="mt-6">
            <a href="/auth" className="inline-block bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
              Start Free
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
