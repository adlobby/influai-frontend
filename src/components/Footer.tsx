import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className="mt-24">
      <div className={`max-w-7xl mx-auto px-6 ${styles.glass} rounded-2xl py-12`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
                CriptAi
              </h3>
              <span className="text-xs text-gray-400">by AdLobby</span>
            </div>
            <p className="text-gray-400 mt-4">
              Multi-channel AI content that fits each platform’s vibe — YouTube, Reels, IG, LinkedIn, X, and Blogs.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <a aria-label="Twitter/X" href="https://x.com/Adlobbynet" className={styles.iconBtn}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2H21l-6.5 7.444L22 22h-6.9l-4.3-5.56L5.7 22H3l7.09-8.123L2 2h6.9l3.9 5.2L18.244 2Zm-2.4 18h1.86L8.3 4H6.35L15.844 20Z"/></svg>
              </a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/adlobby/" className={styles.iconBtn}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7 19H4V9h3v10zM5.5 7.73A1.73 1.73 0 1 1 5.5 4.27a1.73 1.73 0 0 1 0 3.46zM20 19h-3v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.74V19h-3V9h2.88v1.37h.04c.4-.75 1.37-1.54 2.82-1.54 3.02 0 3.58 1.99 3.58 4.58V19z"/></svg>
              </a>
              <a aria-label="YouTube" href="https://www.youtube.com/@karannairrr" className={styles.iconBtn}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.6 3.2c-3.6-.2-11.6-.2-15.2 0C.5 3.5 0 5.8 0 12s.5 8.5 4.4 8.8c3.6.2 11.6.2 15.2 0 3.9-.3 4.4-2.6 4.4-8.8s-.5-8.5-4.4-8.8zM8 16V8l8 4-8 4z"/></svg>
              </a>
              <a aria-label="Instagram" href="https://www.instagram.com/karan.adlobby/" className={styles.iconBtn} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm6.406-1.521a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className={styles.heading}>Product</h4>
            <ul className={styles.links}>
              <li><a href="#features">Features</a></li>
              <li><a href="#templates">Templates</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={styles.heading}>Resources</h4>
            <ul className={styles.links}>
              <li><a href="#">Docs</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={styles.heading}>Stay in the loop</h4>
            <p className="text-gray-400 text-sm mb-3">Monthly tips and launch notes. No spam.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="w-full px-3 py-2 rounded-lg bg-[#0E1324] border border-white/10 text-white placeholder-gray-500"
              />
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white">
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <span>© {new Date().getFullYear()} AdLobby, Inc. All rights reserved.</span>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="#" className={styles.legal}>Privacy</a>
          <a href="#" className={styles.legal}>Terms</a>
          <a href="#" className={styles.legal}>Security</a>
        </div>
      </div>
    </footer>
  );
}
