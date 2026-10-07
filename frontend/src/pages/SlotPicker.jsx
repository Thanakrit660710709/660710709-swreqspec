import { useEffect, useState } from 'react'
import { mockApi } from '../api/client.js'

const PACKAGE_CODES = ['GENERAL', 'EXECUTIVE']

function formatDate(dateString) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'full',
  }).format(new Date(`${dateString}T00:00:00`))
}

function groupSlotsByDate(slots) {
  return slots.reduce((groups, slot) => {
    const dateSlots = groups[slot.slot_date] ?? []
    return { ...groups, [slot.slot_date]: [...dateSlots, slot] }
  }, {})
}

// แสดงวัน ช่วงเวลา และที่นั่งคงเหลือตาม FR-BKG-01 และโหลดใหม่ตาม FR-BKG-06
export default function SlotPicker({ client = mockApi }) {
  const [packageCode, setPackageCode] = useState(PACKAGE_CODES[0])
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    client.getSlots({ dateFrom: new Date().toISOString().slice(0, 10), packageCode })
      .then((nextSlots) => {
        if (active) {
          setSlots(nextSlots)
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [client, packageCode])

  function selectPackage(event) {
    setPackageCode(event.target.value)
    setSelectedSlotId(null)
  }

  const slotsByDate = groupSlotsByDate(slots)

  return (
    <section aria-labelledby="slot-picker-title">
      <h1 id="slot-picker-title" className="text-2xl font-bold text-teal-800">
        เลือกแพ็กเกจและช่วงเวลาตรวจ
      </h1>

      <label className="mt-6 block font-medium text-slate-700" htmlFor="package">
        แพ็กเกจ
      </label>
      <select
        id="package"
        className="mt-2 rounded border border-slate-300 p-2"
        value={packageCode}
        onChange={selectPackage}
      >
        {PACKAGE_CODES.map((code) => (
          <option key={code} value={code}>{code}</option>
        ))}
      </select>

      {loading ? (
        <p className="mt-6" role="status">กำลังโหลดช่วงเวลา...</p>
      ) : (
        <div className="mt-6 space-y-5">
          {Object.entries(slotsByDate).map(([date, dateSlots]) => (
            <article key={date} aria-label={formatDate(date)}>
              <h2 className="font-semibold text-slate-800">{formatDate(date)}</h2>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {dateSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className="rounded border border-teal-300 p-3 text-left"
                    disabled={slot.remaining === 0}
                    aria-pressed={selectedSlotId === slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                  >
                    <span className="block font-medium">{slot.start_time}</span>
                    <span className="text-sm text-slate-600">
                      เหลือ {slot.remaining} ที่นั่ง
                    </span>
                  </button>
                ))}
              </div>
            </article>
          ))}
          {selectedSlotId && (
            <p role="status">
              เลือกช่วงเวลา {slots.find((slot) => slot.id === selectedSlotId)?.start_time}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
