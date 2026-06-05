import React, { useState } from 'react';
import { VillageActivity, Member, Cluster } from '../types';
import { getCurrentThaiYear, getCurrentThaiMonthName, getCurrentThaiShortMonthName } from '../utils/date';

interface ActivitiesProps {
  activities: VillageActivity[];
  members: Member[];
  clusters: Cluster[];
  onAddActivity: (newAct: VillageActivity) => void;
  onRecordActivityReward: (actId: string, memberIds: string[]) => void;
}

export default function Activities({
  activities,
  members,
  clusters,
  onAddActivity,
  onRecordActivityReward
}: ActivitiesProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedActId, setSelectedActId] = useState<string | null>(null);

  // Form states for adding activities
  const [formData, setFormData] = useState({
    title: '',
    category: 'สิ่งแวดล้อม' as 'สิ่งแวดล้อม' | 'กีฬา' | 'ความรู้' | 'กิจกรรมเสร็จสิ้น',
    dateStr: '',
    timeStr: '09:00 - 12:00 น.',
    location: 'ศาลาเอนกประสงค์',
    pointsReward: '15'
  });

  // Checkbox status state inside Activity Attendance Modal
  const [attendeeIds, setAttendeeIds] = useState<Record<string, boolean>>({});

  const handleOpenCheckin = (actId: string) => {
    setSelectedActId(actId);
    const initial: Record<string, boolean> = {};
    members.forEach((m) => {
      initial[m.id] = false;
    });
    setAttendeeIds(initial);
    setIsCheckInOpen(true);
  };

  const handleCheckinSubmit = () => {
    if (!selectedActId) return;

    const chosenIds = Object.keys(attendeeIds).filter((id) => attendeeIds[id]);
    if (chosenIds.length === 0) {
      alert('กรุณาเลือกสมาชิกอย่างน้อย 1 คนร่วมทดสอบเช็คชื่อ');
      return;
    }

    onRecordActivityReward(selectedActId, chosenIds);
    setIsCheckInOpen(false);
    alert('บันทึกการเช็คชื่อผู้เข้าร่วม และร่วมอัปเดตแจกบวกแต้มพิเศษแก่สมาชิกทุกคนแล้ว!');
  };

  const submitNewActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dateStr.trim()) {
      alert('กรุณาป้อนข้อมูลให้ครบถ้วน');
      return;
    }

    const newAct: VillageActivity = {
      id: `act-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      dateStr: formData.dateStr,
      timeStr: formData.timeStr,
      location: formData.location,
      pointsReward: Number(formData.pointsReward) || 15,
      joinedCount: 0,
      status: 'กำลังรับสมัคร',
      iconType: formData.category === 'สิ่งแวดล้อม' ? 'eco' : formData.category === 'กีฬา' ? 'sports' : 'school'
    };

    onAddActivity(newAct);
    setIsAddOpen(false);
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'สิ่งแวดล้อม':
        return { bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200', textCol: 'text-emerald-700', icon: 'eco' };
      case 'กีฬา':
        return { bg: 'bg-rose-50 text-rose-700', border: 'border-rose-200', textCol: 'text-rose-700', icon: 'sports_soccer' };
      case 'ความรู้':
        return { bg: 'bg-amber-50 text-amber-700', border: 'border-amber-200', textCol: 'text-amber-700', icon: 'school' };
      default:
        return { bg: 'bg-slate-50 text-slate-700', border: 'border-slate-200', textCol: 'text-slate-700', icon: 'favorite' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#131b2e] tracking-tight font-headline">กิจกรรมพัฒนาหมู่บ้าน</h2>
          <p className="text-sm font-semibold text-[#7a7489]">รวมกิจกรรมสาธารณะประโยชน์ที่ลูกบ้านร่วมอาสา เพื่อขับเคลื่อนการพัฒนาและรับแต้มสะสม</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#0f766e] text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#0ea5e9] transition-colors shadow-lg shadow-[#0f766e]/20 hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined text-base">local_activity</span>
          สร้างกิจกรรมใหม่
        </button>
      </div>

      {/* ACTIVITIES CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((act) => {
          const theme = getCategoryTheme(act.category);

          return (
            <div
              key={act.id}
              className="bg-white border border-[#cac3da]/50 rounded-[2rem] p-6 shadow-md hover:shadow-xl transition-all flex flex-col gap-5 relative overflow-hidden"
            >
              {/* Category flag */}
              <div className="flex justify-between items-start">
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${theme.bg} ${theme.border} flex items-center gap-1.5`}>
                  <span className="material-symbols-outlined text-base">{theme.icon}</span>
                  {act.category}
                </span>

                <span className="text-sm font-bold text-white bg-[#0f766e] px-3 py-1 rounded-xl shadow-sm">
                  +{act.pointsReward} แต้ม
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#131b2e] tracking-tight leading-snug hover:text-[#0f766e] cursor-pointer">
                  {act.title}
                </h3>
                <div className="mt-3 space-y-2 text-xs font-semibold text-[#7a7489]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>{act.dateStr} • {act.timeStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{act.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">group</span>
                    <span>ผู้สมัครและผ่านเข้ารับแล้ว: <span className="text-[#006631] font-black">{act.joinedCount || 0} คน</span></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span
                  className={`status-badge text-xs font-black py-1.5 px-4 ${
                    act.status === 'เสร็จสิ้นแล้ว'
                      ? 'bg-slate-100 text-[#494457] border border-slate-300'
                      : 'bg-[#62ff96]/20 text-[#00210b] border border-[#1ced7c]'
                  }`}
                >
                  {act.status}
                </span>

                {act.status !== 'เสร็จสิ้นแล้ว' && (
                  <button
                    onClick={() => handleOpenCheckin(act.id)}
                    className="bg-[#0f766e] text-white hover:bg-[#0ea5e9] text-xs font-black py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#0f766e]/20"
                  >
                    <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                    เช็คชื่อผู้เข้ากิจกรรม
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW ACTIVITY MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#cac3da] shadow-2xl">
            <h3 className="text-xl font-black font-headline text-[#131b2e] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f766e] font-bold">local_activity</span> สร้างกิจกรรมใหม่
            </h3>
            <form onSubmit={submitNewActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">หัวข้อ / ชื่อกิจกรรมพัฒนา</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น ร่วมกวาดถนน และกำจัดยางรถระแวกหมู่บ้าน"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">ประเภทกิจกรรม</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  >
                    <option value="สิ่งแวดล้อม">สิ่งแวดล้อม</option>
                    <option value="กีฬา">กีฬา</option>
                    <option value="ความรู้">อบรมความรู้</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">แต้มรางวัล (Points)</label>
                  <input
                    type="number"
                    value={formData.pointsReward}
                    onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">{`วันที่ดำเนินงาน (เช่น 26 ${getCurrentThaiShortMonthName()} ${getCurrentThaiYear()})`}</label>
                <input
                  type="text"
                  required
                  value={formData.dateStr}
                  onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                  placeholder={`เช่น 24 ${getCurrentThaiMonthName()} ${getCurrentThaiYear()}`}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">ช่วงเวลา</label>
                  <input
                    type="text"
                    value={formData.timeStr}
                    onChange={(e) => setFormData({ ...formData, timeStr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">สถานที่นัดรวมพล</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#494457] text-sm font-bold transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#0ea5e9] text-white text-sm font-bold transition-all shadow-md shadow-[#0f766e]/20"
                >
                  บันทึกและประกาศงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVITY ATTENDANCE CHECK-IN MODAL */}
      {isCheckInOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full border border-[#cac3da] shadow-2xl flex flex-col justify-between max-h-[90vh]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#0f766e] tracking-widest block mb-1">
                    เช็คชื่อผู้เข้าร่วมหน้างานจริง
                  </span>
                  <h3 className="text-xl font-black font-headline text-[#131b2e]">
                    {activities.find((a) => a.id === selectedActId)?.title}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCheckInOpen(false)}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <p className="text-xs text-[#7a7489] font-bold mb-4">
                รายชื่อสมาชิกทั้งหมด: ติ๊กเครื่องหมายเพื่อบันทึกว่า "มาจริง" สำหรับแจกแต้มกิจกรรมพัฒนา
              </p>

              {/* Members Selection List with scroll */}
              <div className="space-y-2.5 overflow-y-auto max-h-[45vh] pr-2">
                {members.map((m) => {
                  const isChecked = !!attendeeIds[m.id];
                  const cName = clusters.find((c) => c.id === m.clusterId)?.name || 'คุ้ม';
                  return (
                    <div
                      key={m.id}
                      onClick={() =>
                        setAttendeeIds((prev) => ({
                          ...prev,
                          [m.id]: !prev[m.id]
                        }))
                      }
                      className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#00e475] bg-emerald-50/40'
                          : 'border-slate-100 hover:border-slate-300 bg-[#faf8ff]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center ${
                            isChecked ? 'bg-[#00e475] border-[#00e475]' : 'border-[#cac3da] bg-white'
                          }`}
                        >
                          {isChecked && <span className="material-symbols-outlined text-white text-sm font-black">check</span>}
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#131b2e] block leading-none">{m.name}</span>
                          <span className="text-[10px] font-bold text-[#7a7489]">บ้านเลขที่ {m.houseNo} • {cName.startsWith('คุ้ม') ? cName : `คุ้ม ${m.clusterId} (${cName})`}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#7a7489] bg-white px-2 py-1 rounded border">
                        แต้มปัจจุบัน: {m.points}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsCheckInOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#494457] text-sm font-bold transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCheckinSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#006631] text-white text-sm font-bold transition-all shadow-md hover:bg-[#004b22]"
              >
                บันทึกรายกิจกรรม & จ่ายแต้มสะสม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
