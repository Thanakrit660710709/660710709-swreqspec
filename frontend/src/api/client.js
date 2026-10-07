// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
    const res = await fetch(`${BASE}/slots?${q}`)
    return res.json()
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}

const MOCK_START_TIMES = ['09:00', '10:30', '13:00']

function createMockSlots(packageCode) {
  return Array.from({ length: 30 }, (_, day) => {
    const slotDate = new Date()
    slotDate.setHours(0, 0, 0, 0)
    slotDate.setDate(slotDate.getDate() + day)

    return MOCK_START_TIMES.map((startTime, index) => ({
      id: `${packageCode}-${day}-${index}`,
      slot_date: slotDate.toISOString().slice(0, 10),
      start_time: startTime,
      package_code: packageCode,
      remaining: Math.max(0, 4 - ((day + index) % 5)),
    }))
  }).flat()
}

// API จำลองสำหรับหน้าจอเลือกช่วงเวลาตาม FR-BKG-01 และ FR-BKG-06
export const mockApi = {
  async getSlots({ packageCode }) {
    return createMockSlots(packageCode)
  },
}
