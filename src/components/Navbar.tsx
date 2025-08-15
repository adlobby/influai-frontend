import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`${styles.glass} fixed w-full z-50 py-4 px-6`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">
            CriptAi
          </h1>
          <span className="text-xs text-gray-400">by AdLobby</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className={styles.navlink}>Features</a>
          <a href="#templates" className={styles.navlink}>Templates</a>
          <a href="#pricing" className={styles.navlink}>Pricing</a>
          <a href="#faq" className={styles.navlink}>FAQ</a>
          <a href="#" className={styles.navlink}>Docs</a>
          <a href="#" className={styles.navlink}>Login</a>
        </div>

        <a
          href="/auth"
          className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Start Free
        </a>

        {/* Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A0F1F] py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <a onClick={() => setOpen(false)} href="#features" className={styles.navlink}>Features</a>
            <a onClick={() => setOpen(false)} href="#templates" className={styles.navlink}>Templates</a>
            <a onClick={() => setOpen(false)} href="#pricing" className={styles.navlink}>Pricing</a>
            <a onClick={() => setOpen(false)} href="#faq" className={styles.navlink}>FAQ</a>
            <a onClick={() => setOpen(false)} href="#" className={styles.navlink}>Docs</a>
            <a onClick={() => setOpen(false)} href="#" className={styles.navlink}>Login</a>
            <a
              href="/auth"
              className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Start Free
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
