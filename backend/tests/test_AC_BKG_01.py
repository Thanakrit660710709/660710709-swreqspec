# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH
from app.db.models import Booking


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_successful_booking(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกสำเร็จ
    assert res.status_code == 201
    assert db.query(Booking).filter_by(slot_id=slot.id).count() == 1
    # Then: แสดงหมายเลขคิว (ไม่ตรวจรูปแบบหมายเลขคิว รอ Q-02)
    assert res.json()["queue_no"] is not None
    # Then: ที่นั่งว่างของช่วงนั้นเป็น 0
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_full_slot_offers_alternatives(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 0 ที่
    slot = make_slot(start="09:00", remaining=0)
    make_slot(start="10:00", remaining=1)
    make_slot(start="11:00", remaining=1)
    make_slot(start="12:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: แจ้งเตือนว่าช่วงเวลาเต็ม
    assert res.status_code == 409
    assert res.json()["detail"] == "ช่วงเวลาเต็ม"
    # Then: เสนอช่วงเวลาที่ยังว่าง 3 ตัวเลือกที่ใกล้เวลาที่เลือกที่สุด
    assert len(res.json()["alternatives"]) == 3
    # Then: ไม่สร้างรายการจอง
    assert db.query(Booking).filter_by(slot_id=slot.id).count() == 0


def test_TC_BKG_01_3_rejects_unauthenticated_booking(client, make_slot):
    # Given: ยังไม่ได้รับผลยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then: ปฏิเสธการเข้าถึงข้อมูลผู้รับบริการตาม IF-IDP-01
    assert res.status_code == 401
    # Then: รายละเอียดการตอบกลับ spec ไม่ได้บอก
