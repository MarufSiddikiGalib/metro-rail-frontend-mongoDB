"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const menuLinks = [
  { name: "Home", href: "/" },
  { name: "Ticket Fare", href: "/user/ticket" },
  { name: "Timetable", href: "/user/timetable" },
  { name: "Journey Planer", href: "/user/journey-planner" },
  { name: "Routes", href: "/user/routes" },
  { name: "Rules", href: "/user/rules" },
  { name: "Maps", href: "/user/maps" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  useEffect(() => {
    const handler = () => setUsername(localStorage.getItem("username"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    window.location.href = "/user/login";
  };

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white w-screen min-h-[60px] flex items-center border-b border-[#e4e6f1] px-4 py-0 sticky top-0 z-[100]">
      {/* Logo and site name */}
      <Link href="/" className="flex items-center no-underline mr-5 ">
        <Image
          src="/metro.jpg"
          alt="Dhaka Metro Rail Logo"
          width={40}
          height={40}
          className="rounded-full mr-2 bg-white border-2 border-[#2b4377]"
        />
        <span className="font-bold text-[22px] text-[#111] leading-none hover:text-[#e53935] hover:scale-102 transition">
          Dhaka Metro Rail
        </span>
      </Link>

      {/* Desktop menu */}
      <div className="flex-1 items-center gap-1 hidden md:flex">
        {menuLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`font-medium text-[18px] mx-2 pb-[1px] no-underline border-b-2  hover:text-[#e53935] hover:scale-107 transition  ${
              pathname === link.href
                ? "text-[#e53935] border-[#e53935]"
                : "text-[#222] border-transparent"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      {/* Hamburger icon for mobile */}
      <button
        className="ml-auto flex md:hidden items-center p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Open menu"
      >
        <svg width={28} height={28} fill="none" viewBox="0 0 24 24">
          <path
            stroke="#2b4377"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d={
              mobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Desktop account buttons */}
      <div className="ml-4 items-center gap-1 hidden md:flex">
        {username ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#2b4377]">{username}</span>
            <button
              onClick={handleLogout}
              className="bg-[#e53935] text-white font-semibold rounded-lg px-3 py-[5px] text-[15px] ml-2 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/user/signup"
              className="bg-white text-[#222] font-semibold border-[1.4px] border-[#222] rounded-lg px-3 py-[5px] mr-1 text-[15px] cursor-pointer hover:bg-[#f7f8fa] transition"
            >
              CREATE ACCOUNT
            </Link>
            <Link
              href="/user/login"
              className="bg-white text-[#222] font-semibold border-[1.4px] border-[#222] rounded-lg px-4 py-[5px] text-[15px] cursor-pointer hover:bg-[#f7f8fa] transition"
            >
              LOGIN
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu (drawer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black bg-opacity-30 flex md:hidden">
          <div className="w-4/5 max-w-xs bg-white shadow-lg h-full p-6 animate-slide-in">
            {/* Close button */}
            <button
              className="mb-4 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <path
                  stroke="#2b4377"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col gap-4">
              {menuLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-medium text-[18px] pb-[1px] no-underline border-b-2  hover:text-[#e53935] transition ${
                    pathname === link.href
                      ? "text-[#e53935] border-[#e53935]"
                      : "text-[#222] border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t my-3"></div>
              {username ? (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-[#2b4377]">{username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-[#e53935] text-white font-semibold rounded-lg px-3 py-2 text-[16px] hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/user/signup"
                    className="bg-white text-[#222] font-semibold border-[1.4px] border-[#222] rounded-lg px-3 py-2 text-[16px] cursor-pointer hover:bg-[#f7f8fa] transition"
                  >
                    CREATE ACCOUNT
                  </Link>
                  <Link
                    href="/user/login"
                    className="bg-white text-[#222] font-semibold border-[1.4px] border-[#222] rounded-lg px-4 py-2 text-[16px] cursor-pointer hover:bg-[#f7f8fa] transition"
                  >
                    LOGIN
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Overlay click closes menu */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
            opacity: 0.4;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease;
        }
      `}</style>
    </nav>
  );
}