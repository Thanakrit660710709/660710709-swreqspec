# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ลบของเก่า

---

## 2569-09-23 13.40 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: specs/001-booking/tasks.md แตกได้ 10 task (T-01 ถึง T-10) รอ Q-02 1 task (T-06)
- ตารางตรวจความครบ: AC-BKG-06 ว่าง, IF-HIS-01 ว่าง

### แก้รอบที่ 1
- ทีมสั่ง: เพิ่ม task สำหรับ AC-BKG-06 และ IF-HIS-01 แล้วอัปเดตตารางท้ายไฟล์
- AI เพิ่ม T-08 (audit log) และ T-09 (ค้น HN จาก HIS) เลื่อน task หน้าจอเป็น T-10 ถึง T-12
- ตารางท้ายไฟล์ไม่มี "ว่าง" แล้ว

---

## 2569-09-23 14.20 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_T01_schema.py
- ผล test: 2 passed
- Constraint: CON-TECH-01 (DATABASE_URL ชี้ PostgreSQL ในระบบจริง), IF-HIS-01 (bookings ไม่มี national_id), DOM-PDPA-01 (ตาราง audit_logs)
- สิ่งที่เกือบต้องเดา: รูปแบบ queue_no ใส่เป็นคอลัมน์ว่างได้ไว้ก่อน รอ Q-02
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-27 19.05 คำสั่ง: /implement T-02 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/main.py, backend/tests/conftest.py, backend/tests/test_AC_BKG_05.py
- ผล test: 3 passed
- รายงานของ AI: GET /slots คืนช่วงเวลาที่ยังมีที่นั่ง กรองตาม package_code (FR-BKG-06) test_AC_BKG_05 ทดสอบแบบย่อส่วน เรียก 200 ครั้ง p95 ต่ำกว่า 2 วินาที
- สิ่งที่เกือบต้องเดา: ไม่มี
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-28 20.30 คำสั่ง: /implement T-03 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py และแก้ backend/app/main.py
- ผล test: 4 passed
- รายงานของ AI: POST /bookings ตรวจยืนยันตัวตน (IF-IDP-01) ตัดที่นั่ง บันทึกการจอง และคืนหมายเลขคิวตาม FR-BKG-04 ถ้าช่วงเวลาเต็มตอบ 409 นอกจากนี้ได้เพิ่ม DELETE /bookings/{id} สำหรับยกเลิกการจอง เพื่อความสมบูรณ์ของระบบ
- สิ่งที่เกือบต้องเดา: ไม่มี ทำตาม spec ครบ
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-10-07 15.13 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: ร่าง test cases เนื่องจาก `test-cases.md` ยังไม่มีแถวของ AC-BKG-01
- TC ID ที่เสนอ: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3
- ผลลัพธ์: เพิ่มกรณีทางปกติ ขอบเขตที่ช่วงเวลาเต็ม และทางผิดที่ยังไม่ยืนยันตัวตน โดยยังไม่เขียนโค้ด test
- ประเด็นที่ spec ยังไม่บอก: รูปแบบและวิธีออกหมายเลขคิว (Q-02) และรายละเอียดการตอบกลับเมื่อยังไม่ได้รับผลยืนยันตัวตน

---

## 2569-10-07 15.24 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เขียน test จากแถวสถานะ "ใช้ได้"
- TC ID ที่เขียน: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3 ใน `backend/tests/test_AC_BKG_01.py`
- จำนวน test ในไฟล์: เดิม 1 ตัว เพิ่ม 3 ตัว เป็น 4 ตัว
- ผล test หลังบ้าน: 2 ผ่าน, 1 ไม่ผ่าน (`test_TC_BKG_01_2_full_slot_offers_alternatives`)
- สาเหตุที่ไม่ผ่าน: โค้ดระบบตอบ 201 และสร้างการจองเมื่อช่วงมีที่นั่งว่าง 0 ที่ แทนที่จะปฏิเสธและเสนอ 3 ช่วงเวลา
- ผล test หน้าจอที่มีอยู่: 1 ผ่าน (`npm test`); ยังไม่มีหน้าจอ BookingResult/ConfirmBooking สำหรับ test ส่วนแสดงผลของ AC-BKG-01

---

## 2569-10-07 15.30 คำสั่ง: แก้ไข testcase test_TC_BKG_01_2_full_slot_offers_alternatives FAILED

- ทีมเลือก: แก้โค้ดระบบให้ตรง AC
- ไฟล์ที่แก้: `backend/app/booking/service.py`, `backend/app/booking/router.py`
- การแก้ไข: ช่วงที่ `remaining <= 0` ตอบ 409 ไม่สร้าง booking และคืนช่วงเวลาว่างใกล้เคียงสูงสุด 3 ช่วงในวันเดียวกันหรือวันถัดไป
- ผล test หลังบ้าน: 7 passed, 1 warning

---

## 2569-10-07 15.35 คำสั่ง: /verify specs/001-booking/

- ผล test: หลังบ้าน 7 passed, 1 warning; หน้าจอ 1 passed
- RTM: เพิ่มใน `specs/001-booking/rtm.md`
- ตารางตามรอยไปข้างหน้า: ครบ 1, ยังไม่ถึง 6, รอ 0, ช่องโหว่ 7
- ข้อค้นพบใหม่: F-01 ถึง F-10
- แก้แล้วที่ตรวจพบ: F-11 เงื่อนไขช่วงเต็มและทางเลือก 3 ช่วงทำงานตาม test ที่มี

---

## 2569-10-07 15.41 คำสั่ง: แก้โค้ด: ของแถม อยู่ใน Out of scope (UC-02) ลบ endpoint และ cancel_booking ออก

- แก้ไข: ลบ `DELETE /bookings/{booking_id}` และฟังก์ชัน `cancel_booking` ออกจาก `backend/app/booking/router.py` และ `backend/app/booking/service.py`
- ผล test หลังบ้าน: 7 passed, 1 warning
- ผล test หน้าจอ: 1 passed
- RTM: ย้าย F-09 ไปหัวข้อ "แก้แล้ว"
