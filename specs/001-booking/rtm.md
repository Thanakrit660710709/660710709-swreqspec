# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 15.35 | test: 8 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/router.py:get_slots`, `backend/app/slots/service.py:list_available_slots` | `test_AC_BKG_05` ผ่าน แต่ไม่ตรวจรายการและขอบเขต 30 วัน | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มีการตรวจคิวเดิมในวันเดียวกัน | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05 พร้อมทำ | `backend/app/booking/service.py:find_alternatives`, `backend/app/booking/router.py:create_booking` | ไม่มี test ของ AC-BKG-03 | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02 | `backend/app/booking/service.py:create_booking`, `backend/app/booking/router.py:create_booking` | `test_AC_BKG_01`, `test_TC_BKG_01_1_successful_booking` ผ่าน; ไม่พบการส่งคำขอข้อความ | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ | ไม่มีโค้ดคิวแจ้งเตือนหรือการอ่านรายละเอียดการจอง | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10 พร้อมทำ | `backend/app/slots/service.py:list_available_slots` กรอง `package_code`; ยังไม่มีหน้าจอเปลี่ยนแพ็กเกจ | ไม่มี test เฉพาะ FR-BKG-06 | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` ผ่าน แต่เรียกตามลำดับ ไม่ใช่ผู้ใช้พร้อมกัน 200 คน | ช่องโหว่ |
| NFR-SEC-01 | ไม่มี AC | ยังไม่มี task ที่เสร็จ | ไม่มีการตั้งค่า TLS ในแอปหรือการทดสอบการรับส่ง | ไม่มี | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ไม่มีโค้ด retry/คิวส่งข้อความ | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC โดยตรง | ยังไม่มี task ที่เสร็จ | ไม่มีหน้าจอและไม่มีการทดสอบผู้ใช้ 8 ใน 10 คนภายใน 3 นาที | ไม่มี | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC โดยตรง | T-01 เสร็จ | `backend/app/config.py:DATABASE_URL`, `backend/app/db/session.py:engine` ใช้ PostgreSQL ได้เมื่อกำหนดค่า แต่ค่าเริ่มต้นเป็น SQLite | `test_T01_tables_created` ผ่านบน SQLite | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-01 เสร็จ, T-08 พร้อมทำ | มี `AuditLog` ใน `backend/app/db/models.py` แต่ไม่มีการบันทึกทุกการเข้าถึงหรือ retention 1 ปี | ไม่มี | ช่องโหว่ |
| IF-IDP-01 | ไม่มี AC โดยตรง | T-03 เสร็จ | `backend/app/auth/idp.py:get_verified_hn` ป้องกัน `POST /bookings`; ยังไม่มี endpoint ข้อมูลการจองที่ตรวจได้ | `test_TC_BKG_01_3_rejects_unauthenticated_booking` ผ่าน | ครบ |
| IF-HIS-01 | ไม่มี AC โดยตรง | T-01 เสร็จ, T-09 พร้อมทำ | ไม่มี HIS lookup; `Booking` เก็บ HN แต่ `BookingRequest` รับ `national_id` | `test_T01_no_national_id` ผ่านเฉพาะ schema | ช่องโหว่ |
| IF-NOT-01 | ไม่มี AC โดยตรง | T-07 พร้อมทำ | ไม่มีโค้ดส่ง SMS/LINE แบบ asynchronous | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/slots/router.py:get_slots` | FR-BKG-01, FR-BKG-06 | ไม่ครบ | คืนช่วงว่างและจำนวนที่นั่ง แต่ service จำกัด 14 วันแทน 30 วัน; รองรับ package filter ฝั่ง API |
| `backend/app/slots/service.py:list_available_slots` | FR-BKG-01, FR-BKG-06 | ไม่ครบ | `DAYS_AHEAD = 14` ไม่ตรง FR-BKG-01 ที่กำหนด 30 วัน |
| `backend/app/booking/router.py:POST /bookings` | FR-BKG-03, FR-BKG-04, IF-IDP-01 | ไม่ครบ | ตรวจ IDP และจองได้; มี 409 ทางเลือก แต่ไม่มีการส่งข้อความ และ response ทางเลือกเป็นพฤติกรรมของ T-05 ที่ยังไม่เสร็จ |
| `backend/app/booking/service.py:create_booking` | FR-BKG-04 | ไม่ครบ | บันทึกและตัดที่นั่ง แต่สร้างเลขคิว `A001` ทั้งที่ Q-02 ยังไม่ตอบ และไม่วางงานแจ้งเตือน |
| `backend/app/booking/service.py:next_queue_no` | FR-BKG-04, Q-02 | ไม่ตรง | ใช้รูปแบบและวิธีนับเลขคิวที่ spec ยังเปิดคำถามไว้ |
| `backend/app/booking/service.py:find_alternatives` | FR-BKG-03 | ยังยืนยันไม่ได้ | มีการค้นหา 3 รายการในวันเลือกและวันถัดไป แต่ยังไม่มี AC-BKG-03 test และไม่มีการตรวจกรณีทางเลือกน้อยกว่า 3 |
| `backend/app/booking/router.py:BookingRequest` และ logger | IF-HIS-01 | ไม่ตรง | รับและเขียน `national_id` ลง log ทั้งที่ควรส่งต่อ HIS และไม่เก็บเลขบัตรประชาชนในระบบการจอง |
| `backend/app/auth/idp.py:get_verified_hn` | IF-IDP-01 | ตรงบางส่วน | ป้องกัน POST booking ด้วย token จำลอง แต่ยังไม่ใช่การตรวจผลจากระบบ IDP จริง |
| `backend/app/db/models.py:AuditLog` | DOM-PDPA-01 | ไม่ครบ | มีตารางและฟิลด์ที่ต้องใช้ แต่ไม่มีการสร้าง log จาก request และไม่มีกลไกเก็บไม่น้อยกว่า 1 ปี |
| `backend/app/config.py:DATABASE_URL` | CON-TECH-01 | ไม่ครบ | ระบบจริงรองรับ PostgreSQL แต่ค่าเริ่มต้นของแอปเป็น SQLite ซึ่งไม่ตรง constraint หากไม่ตั้ง environment |
| `frontend/src/App.jsx` | FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05, FR-BKG-06 | ไม่ครบ | เป็นเพียงหน้าโครง ไม่มีหน้าจอเลือกเวลา ยืนยัน หรือแสดงเลขคิว |
| `frontend/src/api/client.js:api` | FR-BKG-01, FR-BKG-03, FR-BKG-04 | ไม่ครบ | มี client แต่ยังไม่มีหน้าจอเรียกใช้และไม่มีการจัดการผลลัพธ์บน UI |
| `backend/tests/test_AC_BKG_01.py:test_AC_BKG_01` | AC-BKG-01 | ไม่ครบ | ตรวจเพียง status 201 จึงเป็น test อ่อน แต่ test `TC-BKG-01-*` ตรวจข้อมูลเพิ่มเติมแล้ว |
| `backend/tests/test_AC_BKG_05.py:test_AC_BKG_05` | AC-BKG-05 | ไม่ครบ | ตรวจ 200 requests แบบ sequential ไม่ใช่ concurrent users 200 คน |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | ตัวเลขไม่ตรง spec | `backend/app/slots/service.py:DAYS_AHEAD` | FR-BKG-01 | กำหนด 14 วัน แต่ FR กำหนด 30 วัน ทำให้ช่วงวันที่ 15-30 ไม่ถูกแสดง | |
| F-02 | เดา Q-xx | `backend/app/booking/service.py:next_queue_no` | Q-02, FR-BKG-04 | เลือกรูปแบบ `A001` และการรีเซ็ตรายวัน ทั้งที่ Q-02 ยังไม่มีคำตอบ | |
| F-03 | โค้ดไม่มี FR | `backend/app/booking/service.py:create_booking` | FR-BKG-04, IF-NOT-01 | ไม่ส่งคำขอข้อความยืนยันหรือวางงาน asynchronous หลังบันทึกการจอง | |
| F-04 | FR ไม่มี AC | spec.md / tasks.md | FR-BKG-06 | FR-BKG-06 ระบุการคำนวณใหม่เมื่อเปลี่ยนแพ็กเกจ แต่ไม่มี AC ที่ตรวจพฤติกรรมนี้ | |
| F-05 | test อ่อน | `backend/tests/test_AC_BKG_05.py:test_AC_BKG_05` | NFR-PERF-01 | วัด 200 requests ต่อเนื่อง ไม่ใช่ผู้ใช้พร้อมกัน 200 คนตาม NFR | |
| F-06 | ละเมิด Constraint | `backend/app/booking/router.py:BookingRequest` และ logger | IF-HIS-01 | รับ `national_id` และเขียนลง log ทั้งที่ constraint กำหนดให้ค้นผ่าน HIS และไม่เก็บเลขบัตรประชาชนใน booking flow | |
| F-07 | ละเมิด Constraint | `backend/app/db/models.py:AuditLog`, ไม่มี middleware | DOM-PDPA-01 | มีเพียง schema แต่ไม่บันทึก audit log ทุกครั้งที่เข้าถึงข้อมูลสุขภาพ และไม่แสดงการเก็บอย่างน้อย 1 ปี | |
| F-08 | ละเมิด Constraint | `backend/app/config.py:DATABASE_URL` | CON-TECH-01 | ค่าเริ่มต้นเป็น SQLite ไม่ใช่ PostgreSQL ตามมาตรฐานฝ่าย IT | |
| F-10 | AC ไม่มี test | AC-BKG-02, AC-BKG-03, AC-BKG-04, AC-BKG-06 และส่วน UI ของ AC-BKG-01 | AC-BKG-01 ถึง AC-BKG-06 | AC-BKG-02/03/04/06 ยังไม่มี test และ AC-BKG-01 ยังไม่มี test หน้าจอสำหรับส่วนแสดงหมายเลขคิว | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-11 | แก้เงื่อนไขช่วงเต็มเป็น `remaining <= 0` และคืนทางเลือกสูงสุด 3 ช่วง | test `test_TC_BKG_01_2_full_slot_offers_alternatives` ผ่านในรอบนี้ |
| F-09 | ลบ `DELETE /bookings/{booking_id}` และ `cancel_booking` ออกจาก router/service | ค้นหาไม่พบ endpoint หรือฟังก์ชันดังกล่าว และ test ทั้งสองฝั่งผ่าน |
