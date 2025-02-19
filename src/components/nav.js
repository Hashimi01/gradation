"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [selected, setSelected] = useState("About");
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { title: "About", href: "home" },
    { title: "Rating", href: "rat" },
    { title: "Vote List", href: "votes" },
    { title: "About Me", href: "aboutdev" },
  ];

  // ✅ حفظ التبويب المختار عند تحميل الصفحة
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = localStorage.getItem("selectedTab");
      if (storedTab) setSelected(storedTab);
    }
  }, []);

  // ✅ تحديث التبويب عند ظهور القسم في الشاشة
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const matchingItem = navItems.find((item) => item.href === sectionId);
            if (matchingItem) {
              setSelected(matchingItem.title);
              localStorage.setItem("selectedTab", matchingItem.title);
            }
          }
        });
      },
      { threshold: 0.5 } // يتم التفعيل عندما يظهر 50% من القسم
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // ✅ التمرير إلى القسم المحدد عند النقر
  const scrollToSection = (id) => {
    if (typeof window !== "undefined") {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full fixed top-0 z-50 px-4">
      <motion.div
        className="max-w-7xl mx-auto pt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="w-full flex items-center justify-between h-16 rounded-2xl bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-lg px-6 shadow-lg shadow-purple-500/10 relative">
          <motion.div className="flex items-center gap-3">
            <Image src="/12.png" alt="logo" width={32} height={32} className="rounded-full border-2 border-purple-400/30" />
            <span className="text-white font-semibold hidden sm:block">Hashimi</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex flex-row list-none gap-2">
              {navItems.map((item) => (
                <motion.li key={item.title}>
                  <a
                    href="#"
                    className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                      selected === item.title ? "text-white" : "text-gray-300 hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                  >
                    {selected === item.title && (
                      <motion.div
                        layoutId="bubble"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl -z-10 border border-purple-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {item.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button className="md:hidden text-white p-2 rounded-lg hover:bg-white/10" whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-4 right-4 bg-gradient-to-b from-purple-900/95 to-blue-900/95 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-purple-500/20"
            >
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <motion.li key={item.title}>
                    <li>
                    <a
                      href="#"
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selected === item.title ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.href);
                        setIsOpen(false);
                      }}
                    >
                      {item.title}
                    </a></li>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
