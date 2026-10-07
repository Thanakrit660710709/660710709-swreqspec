import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SlotPicker from '../pages/SlotPicker.jsx'

function createClient(slotsByPackage) {
  const getSlots = vi.fn(({ packageCode }) =>
    Promise.resolve(slotsByPackage[packageCode] ?? []),
  )
  return { getSlots }
}

test('แสดงช่วงเวลาและที่นั่งคงเหลือภายใน 30 วัน', async () => {
  const slots = Array.from({ length: 30 }, (_, day) => ({
    id: `GENERAL-${day}`,
    slot_date: `2026-09-${String(day + 1).padStart(2, '0')}`,
    start_time: '09:00',
    package_code: 'GENERAL',
    remaining: 2,
  }))
  const client = createClient({ GENERAL: slots })

  render(<SlotPicker client={client} />)

  expect(await screen.findAllByText('เหลือ 2 ที่นั่ง')).toHaveLength(30)
  expect(screen.getAllByRole('article')).toHaveLength(30)
  expect(client.getSlots).toHaveBeenCalledWith(expect.objectContaining({ packageCode: 'GENERAL' }))
})

test('โหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
  const client = createClient({
    GENERAL: [{
      id: 'general-1',
      slot_date: '2026-09-23',
      start_time: '09:00',
      package_code: 'GENERAL',
      remaining: 2,
    }],
    EXECUTIVE: [{
      id: 'executive-1',
      slot_date: '2026-09-23',
      start_time: '13:00',
      package_code: 'EXECUTIVE',
      remaining: 1,
    }],
  })

  render(<SlotPicker client={client} />)
  await screen.findByText('09:00')

  fireEvent.change(screen.getByLabelText('แพ็กเกจ'), { target: { value: 'EXECUTIVE' } })

  await waitFor(() => {
    expect(client.getSlots).toHaveBeenLastCalledWith(
      expect.objectContaining({ packageCode: 'EXECUTIVE' }),
    )
  })
  expect(await screen.findByText('13:00')).toBeTruthy()
})

test('เลือกช่วงเวลาที่ต้องการตรวจได้', async () => {
  const client = createClient({
    GENERAL: [{
      id: 'general-1',
      slot_date: '2026-09-23',
      start_time: '09:00',
      package_code: 'GENERAL',
      remaining: 2,
    }],
  })

  render(<SlotPicker client={client} />)
  const timeSlot = await screen.findByRole('button', { name: /09:00/ })

  fireEvent.click(timeSlot)

  expect(timeSlot.getAttribute('aria-pressed')).toBe('true')
  expect(screen.getByRole('status').textContent).toContain('เลือกช่วงเวลา 09:00')
})
