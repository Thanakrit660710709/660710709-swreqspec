# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง: [plan.md](./plan.md)
- วันที่: 2569-09-23

มีทั้งหมด 16 tasks โดยมี 2 tasks ที่ต้องรอคำตอบของ Open Question `Q-02`
งานที่รอ `Q-02` จำกัดอยู่ที่การกำหนดวิธีออกและการแสดงหมายเลขคิว ส่วนงานโครงสร้างและการจองที่ไม่ขึ้นกับรูปแบบเลขคิวทำต่อได้

## รายการงาน

### T-01 สร้างตารางและ migration
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01, FR-BKG-01, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03, T-05 และ T-09
- ไฟล์ที่แตะ: `backend/app/db/models.py`, `backend/app/db/session.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings` และ `audit_logs` ได้ และตาราง `bookings` ไม่มีคอลัมน์เลขบัตรประชาชน
- สถานะ: พร้อมทำ

### T-02 บังคับตรวจผลยืนยันตัวตน
- รองรับ: IF-IDP-01, ASM-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03, T-05, T-06, T-07 และ T-10
- ไฟล์ที่แตะ: `backend/app/auth/idp.py`, `backend/app/main.py`, `backend/tests/test_idp_guard.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: endpoint ที่เข้าถึงข้อมูลผู้รับบริการปฏิเสธคำขอที่ไม่มีผลยืนยันตัวตน และยอมให้คำขอที่ยืนยันแล้วผ่าน
- สถานะ: พร้อมทำ

### T-03 สร้าง API ค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04 และ T-11
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/slots/router.py`, `backend/app/main.py`, `backend/tests/test_slots.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `GET /slots` คืนช่วงเวลาภายใน 30 วันพร้อม `remaining` และคำนวณรายการใหม่เมื่อ `package_code` เปลี่ยน
- สถานะ: พร้อมทำ

### T-04 ทดสอบประสิทธิภาพการค้นหาช่วงเวลา
- รองรับ: NFR-PERF-01, FR-BKG-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_05.py`
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: การทดสอบการค้นหาพร้อมกัน 200 คำขอรายงาน p95 ไม่เกิน 2 วินาที
- สถานะ: พร้อมทำ

### T-05 สร้างการจองและตัดที่นั่ง
- รองรับ: FR-BKG-04, IF-HIS-01, ASM-02
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_01.py`
- ต้องทำหลัง: T-01, T-02, T-03
- เสร็จเมื่อ: `POST /bookings` บันทึกการจองและลด `remaining` จาก 1 เป็น 0 ได้สำเร็จ
- สถานะ: พร้อมทำ

### T-06 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02, ASM-04
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_02.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: การจองของ HN เดิมในวันเดียวกันถูกปฏิเสธและตอบหมายเลขรายการจองเดิม
- สถานะ: พร้อมทำ

### T-07 เสนอช่วงเวลาใกล้เคียงเมื่อเต็ม
- รองรับ: FR-BKG-03, ASM-02
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_03.py`
- ต้องทำหลัง: T-03, T-05
- เสร็จเมื่อ: เมื่อช่วงเวลาถูกจองเต็ม API ตอบ `409` พร้อม 3 ช่วงที่ว่างใกล้ที่สุดในวันเดียวกันหรือวันถัดไป และไม่สร้างการจองซ้อน
- สถานะ: พร้อมทำ

### T-08 จัดคิวส่งข้อความและส่งซ้ำ
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_04.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: การส่งข้อความที่ล้มเหลวไม่ทำให้การจองหาย และมีงานส่งซ้ำในคิวภายใน 5 นาที โดยไม่เกิน 3 ครั้งตาม `ASM-03`
- สถานะ: พร้อมทำ

### T-09 บันทึก audit log
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: `backend/app/audit/middleware.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_06.py`
- ต้องทำหลัง: T-01, T-02, T-05
- เสร็จเมื่อ: การเปิดดูข้อมูลการจองสร้าง audit log ที่มี `actor_id`, `accessed_at` และ HN และข้อมูลถูกเก็บใน `audit_logs`
- สถานะ: พร้อมทำ

### T-10 สร้างการค้นหา HN จาก HIS
- รองรับ: IF-HIS-01, IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05
- ไฟล์ที่แตะ: `backend/app/his/client.py`, `backend/app/main.py`, `backend/tests/test_his_lookup.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: `GET /patients/lookup` ส่งเลขบัตรไปยัง HIS ได้ คืน HN และไม่บันทึกเลขบัตรลงในข้อมูลการจอง
- สถานะ: พร้อมทำ

### T-11 สร้างหน้าจอเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-14
- ไฟล์ที่แตะ: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอเรียก API จำลอง แสดงวัน/ช่วงเวลาและที่นั่งคงเหลือภายใน 30 วัน และโหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: พร้อมทำ

### T-12 สร้างหน้ายืนยันและแสดงช่วงเวลาเต็ม
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/__tests__/AC-BKG-03.test.jsx`
- ต้องทำหลัง: T-11
- เสร็จเมื่อ: API จำลองที่ตอบ `409` ทำให้หน้าจอแสดงข้อความ "ช่วงเวลาเต็ม" และตัวเลือกที่ว่าง 3 รายการ
- สถานะ: พร้อมทำ

### T-13 สร้างหน้าแสดงผลการจอง
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานหน้าจอพื้นฐานของ T-14 และรอ Q-02 สำหรับรูปแบบหมายเลขคิว
- ไฟล์ที่แตะ: `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/BookingResult.test.jsx`
- ต้องทำหลัง: T-08
- เสร็จเมื่อ: โครงหน้าจอพร้อมแสดงผลสำเร็จและหมายเลขคิวจาก API จำลอง แม้สถานะการส่งข้อความจะล้มเหลว
- สถานะ: รอ Q-02

### T-14 ต่อหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานเชื่อมต่อของ T-03, T-07, T-08, T-11, T-12 และ T-13
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/vite.config.js`
- ต้องทำหลัง: T-03, T-07, T-08, T-11, T-12, T-13
- เสร็จเมื่อ: หน้าจอเรียก endpoint จริงผ่าน `/api` และแสดงผลสำเร็จ/เต็ม/ส่งข้อความไม่สำเร็จตาม response ของหลังบ้าน
- สถานะ: รอ Q-02

### T-15 กำหนดการสื่อสารแบบเข้ารหัส
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของการเปิดใช้งานระบบ
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/main.py`, `backend/tests/test_tls_config.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: การตั้งค่าและการทดสอบการเชื่อมต่อระบุให้ใช้ TLS 1.2 ขึ้นไป และไม่เปิด endpoint สำหรับข้อมูลการจองผ่าน HTTP ที่ไม่เข้ารหัสในระบบใช้งานจริง
- สถานะ: พร้อมทำ

### T-16 ทดสอบความง่ายต่อการใช้งาน
- รองรับ: NFR-USE-01, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นการทดสอบคุณภาพการใช้งานตาม NFR-USE-01
- ไฟล์ที่แตะ: `frontend/src/__tests__/usability.test.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/pages/ConfirmBooking.jsx`
- ต้องทำหลัง: T-11, T-12, T-14
- เสร็จเมื่อ: ผู้ใช้ใหม่ 10 คนทำ scenario การจองได้สำเร็จภายใน 3 นาทีและอย่างน้อย 8 คนทำได้โดยไม่ขอความช่วยเหลือ
- สถานะ: พร้อมทำ

## ตารางตรวจความครบของ Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-05 |
| AC-BKG-02 | T-06 |
| AC-BKG-03 | T-07, T-12 |
| AC-BKG-04 | T-08 |
| AC-BKG-05 | T-04 |
| AC-BKG-06 | T-09 |

## ตารางตรวจความครบของ Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-09 |
| IF-IDP-01 | T-02, T-10 |
| IF-HIS-01 | T-01, T-05, T-10 |
| IF-NOT-01 | T-08, T-14 |

## สิ่งที่ยังไม่ทำ

- `Q-02` หมายเลขคิวรีเซ็ตรายวันหรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น `A001`) ยังต้องถามเจ้าหน้าที่เวชระเบียน
- T-13 และ T-14 รอคำตอบ `Q-02` เพราะเกี่ยวข้องกับการกำหนดและแสดงหมายเลขคิว
