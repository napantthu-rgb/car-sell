"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import CarCard from "./components/CarCard"
import BannerSlider from "./components/BannerSlider"

export default function Home() {

  const [cars, setCars] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [search, setSearch] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)


  // ---------------- โหลดรถ ----------------
  async function loadCars() {

    let query = supabase
      .from("cars")
      .select("*, categories(name)")
      .order("created_at", { ascending: false })

    if (search) {
      query = query.ilike("model", `%${search}%`)
    }

    if (price === "300") {
      query = query.lte("price", 300000)
    }

    if (price === "500") {
      query = query.gte("price", 300000).lte("price", 500000)
    }

    if (price === "500plus") {
      query = query.gte("price", 500000)
    }

    // ✅ filter category
    if (category) {
      query = query.eq("category_id", category)
    }

    const { data } = await query

    setCars(data || [])

  }


  // ---------------- โหลด Banner ----------------
  const loadBanners = async () => {

    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false })

    setBanners(data || [])

  }


  // ---------------- โหลด Category ----------------
  const loadCategories = async () => {

    const { data } = await supabase
      .from("categories")
      .select("*")

    setCategories(data || [])

  }


  // ---------------- INIT ----------------
  useEffect(() => {
    loadCars()
    loadBanners()
    loadCategories()
  }, [])



  return (

    <div className="bg-[#F5F5F7] min-h-screen font-sans">

      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">

        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-2xl font-extrabold tracking-tight">🚗 CarDee</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-red-600 transition-colors">ซื้อรถ</a>
            <a href="#" className="hover:text-red-600 transition-colors">ขายรถ</a>
            <a href="#" className="hover:text-red-600 transition-colors">เกี่ยวกับเรา</a>
            <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors">
              ลงขายรถฟรี
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
            <p className="cursor-pointer text-sm text-gray-700 py-2 hover:text-red-600 transition-colors">ซื้อรถ</p>
          </div>
        )}

      </header>


      {/* 🔥 BANNER */}
      <section className="w-full">
        <BannerSlider banners={banners} />
      </section>


      {/* 🔎 SEARCH BOX */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">

        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6">

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">ค้นหารถที่ใช่</p>

          <div className="flex flex-col md:flex-row gap-3">

            {/* Search input */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="ค้นหายี่ห้อ รุ่น..."
              />
            </div>

            {/* Price filter */}
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white md:w-48"
            >
              <option value="">ราคาทั้งหมด</option>
              <option value="300">ต่ำกว่า 300,000</option>
              <option value="500">300,000 – 500,000</option>
              <option value="500plus">500,000+</option>
            </select>

            {/* ✅ Category filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white md:w-44"
            >
              <option value="">ทุกหมวด</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={loadCars}
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-8 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 whitespace-nowrap"
            >
              ค้นหา
            </button>

          </div>

        </div>

      </section>


      {/* NEW CARS */}
      <section className="max-w-6xl mx-auto px-4 mt-10 md:px-10">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            🚗 รถลงใหม่ล่าสุด
          </h2>
          <span className="text-xs text-gray-400 font-medium">{cars.slice(0, 6).length} คัน</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {cars.slice(0, 6).map((car: any) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

      </section>


      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 mt-12">
        <hr className="border-gray-200" />
      </div>


      {/* ALL CARS */}
      <section className="max-w-6xl mx-auto px-4 mt-10 pb-16 md:px-10 md:pb-20">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            รถมือสองทั้งหมด
          </h2>
          <span className="text-xs text-gray-400 font-medium">{cars.length} คัน</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {cars.map((car: any) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

      </section>


      {/* SELL CTA */}
      <section className="bg-gradient-to-r from-red-600 to-red-500 text-white py-14 md:py-16">

        <div className="max-w-6xl mx-auto text-center px-4">

          <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-red-200">ฟรี! ไม่มีค่าใช้จ่าย</p>

          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            ขายรถของคุณวันนี้
          </h2>

          <p className="mb-7 text-sm md:text-base text-red-100 max-w-md mx-auto">
            ลงประกาศขายรถง่าย ๆ ใน 1 นาที เข้าถึงผู้ซื้อหลายพันคน
          </p>

          <button className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-150">
            ลงขายรถ →
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm px-4">

          <div>
            <h3 className="font-bold text-white mb-2">🚗 CarDee</h3>
            <p className="leading-relaxed">เว็บไซต์ซื้อขายรถมือสองออนไลน์ที่เชื่อถือได้</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">ติดต่อเรา</h3>
            <p>support@car.com</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">ลิงก์</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white transition-colors">ซื้อรถ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ขายรถ</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-xs text-gray-600">
          © 2025 CarDee. All rights reserved.
        </div>

      </footer>

    </div>

  )

}