"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AdminPage() {

  const [user, setUser] = useState<any>(null)
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")

  const [page, setPage] = useState(1)

  const perPage = 5


  // ================= LOGIN =================

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
    setLoading(false)
  }

  useEffect(() => {
    checkUser()
    fetchCars()
  }, [])

  const login = async (e: any) => {
    e.preventDefault()

    const form = new FormData(e.target)

    await supabase.auth.signInWithPassword({
      email: form.get("email") as string,
      password: form.get("password") as string
    })

    checkUser()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }


  // ================= FETCH =================

  const fetchCars = async () => {
    const { data } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false })

    setCars(data || [])
  }


  // ================= DELETE =================

  const deleteCar = async (id: number) => {

    if (!confirm("ลบรถคันนี้ ?")) return

    await supabase
      .from("cars")
      .delete()
      .eq("id", id)

    fetchCars()

  }


  // ================= UPDATE STATUS =================

  const updateStatus = async (id: number, status: string) => {

    await supabase
      .from("cars")
      .update({ status })
      .eq("id", id)

    fetchCars()

  }


  // ================= SELL (ตัดสต็อก) =================

  const sellCar = async (car: any) => {

    if (car.stock <= 1) {

      await supabase
        .from("cars")
        .update({
          stock: 0,
          status: "sold"
        })
        .eq("id", car.id)

    } else {

      await supabase
        .from("cars")
        .update({
          stock: car.stock - 1
        })
        .eq("id", car.id)

    }

    fetchCars()

  }


  // ================= FILTER =================

  const filtered = cars.filter((car) => {

    return (

      `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase())

      && (brandFilter ? car.brand.toLowerCase().includes(brandFilter.toLowerCase()) : true)

      && (yearFilter ? String(car.year) === yearFilter : true)

      && (priceFilter ? Number(car.price) <= Number(priceFilter) : true)

    )

  })


  // ================= PAGINATION =================

  const totalPages = Math.ceil(filtered.length / perPage)

  const start = (page - 1) * perPage

  const paginatedCars = filtered.slice(start, start + perPage)


  // ================= STATS =================

  const totalCars = cars.length
  const totalValue = cars.reduce((sum, c) => sum + Number(c.price), 0)


  // ================= LOGIN PAGE =================

  if (!user) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">

        <div className="w-full max-w-sm px-4">

          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-3xl font-extrabold text-white tracking-tight">🚗 CarDee</span>
            <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
          </div>

          <form
            onSubmit={login}
            className="bg-white rounded-2xl shadow-2xl p-8 space-y-4"
          >

            <h1 className="text-xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ</h1>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">อีเมล</label>
              <input
                name="email"
                placeholder="admin@email.com"
                className="border border-gray-200 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">รหัสผ่าน</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="border border-gray-200 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-xl font-semibold text-sm transition-colors mt-2">
              เข้าสู่ระบบ
            </button>

          </form>

        </div>

      </div>

    )

  }


  // ================= DASHBOARD =================

  return (

    <div className="min-h-screen bg-[#F5F5F7]">

      {/* TOP BAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">🚗 CarDee</span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>

          <div className="flex items-center gap-3">

            <a
              href="/admin/add"
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <span className="text-base leading-none">+</span> เพิ่มรถ
            </a>

            <a
              href="admin/banner/"
              className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              🖼 จัดการ Banner
            </a>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              ออกจากระบบ
            </button>

          </div>

        </div>
      </header>


      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">ยินดีต้อนรับ · {user?.email}</p>
        </div>


        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">🚗</div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">รถทั้งหมด</p>
              <p className="text-2xl font-extrabold text-gray-900">{totalCars} <span className="text-sm font-normal text-gray-400">คัน</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-xl">💰</div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">มูลค่ารวม</p>
              <p className="text-2xl font-extrabold text-red-600">{totalValue.toLocaleString()} <span className="text-sm font-normal text-gray-400">บาท</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">📄</div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">รถในหน้านี้</p>
              <p className="text-2xl font-extrabold text-gray-900">{paginatedCars.length} <span className="text-sm font-normal text-gray-400">คัน</span></p>
            </div>
          </div>

        </div>


        {/* FILTER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">ตัวกรอง</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                placeholder="ค้นหา..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 pl-9 pr-3 py-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <input
              placeholder="ยี่ห้อ"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="border border-gray-200 px-3 py-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />

            <input
              placeholder="ปี เช่น 2022"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-gray-200 px-3 py-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />

            <input
              placeholder="ราคาไม่เกิน (บาท)"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="border border-gray-200 px-3 py-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />

          </div>

        </div>


        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">

          {/* Table header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">รายการรถ</p>
            <span className="text-xs text-gray-400">{filtered.length} รายการ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">รถ</th>
                  <th className="px-4 py-3 text-center">ปี</th>
                  <th className="px-4 py-3 text-center">ราคา</th>
                  <th className="px-4 py-3 text-center">สต็อก</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                  <th className="px-4 py-3 text-center">จัดการ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">

                {paginatedCars.map((car) => {

                  const img = car.image_url?.split(",")[0]

                  return (

                    <tr key={car.id} className="hover:bg-gray-50 transition-colors">

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={img}
                            className="w-20 h-14 object-cover rounded-xl bg-gray-100"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{car.brand} {car.model}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{car.mileage?.toLocaleString()} km</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center text-sm text-gray-600">{car.year}</td>

                      <td className="px-4 py-4 text-center text-sm font-bold text-red-600">
                        ฿{Number(car.price).toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block min-w-[2rem] text-center text-sm font-bold rounded-lg px-2 py-0.5 ${
                          (car.stock ?? 0) === 0
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {car.stock ?? 0}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          car.status === "available"
                            ? "bg-green-100 text-green-700"
                            : car.status === "sold"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            car.status === "available"
                              ? "bg-green-500"
                              : car.status === "sold"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`} />
                          {car.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">

                          <a
                            href={`/admin/edit/${car.id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Edit
                          </a>

                          <button
                            onClick={() => sellCar(car)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            ขาย
                          </button>

                          <button
                            onClick={() => updateStatus(car.id, "sold")}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Sold
                          </button>

                          <button
                            onClick={() => deleteCar(car.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            ลบ
                          </button>

                        </div>
                      </td>

                    </tr>

                  )

                })}

              </tbody>

            </table>

            {paginatedCars.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                ไม่พบรายการรถ
              </div>
            )}

          </div>
        </div>


        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">

            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-xl border bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              ←
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {

              const p = i + 1

              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                    page === p
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white border text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )

            })}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-xl border bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              →
            </button>

          </div>
        )}

      </main>

    </div>

  )

}