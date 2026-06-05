import React, { useState } from 'react';
import { Meeting } from '../types';
import { getCurrentThaiYear } from '../utils/date';

interface MeetingsProps {
  meetings: Meeting[];
  onAddMeeting: (newMeeting: Meeting) => void;
  onNavigateToCheckin: (meetingId: string) => void;
  totalMembersCount: number;
}

export default function Meetings({
  meetings,
  onAddMeeting,
  onNavigateToCheckin,
  totalMembersCount
}: MeetingsProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dateStr: '',
    timeStr: '09:00 - 12:00 น.',
    location: 'ศาลาประชาคม',
    pointsReward: '10'
  });

  // Current active/open meeting
  const activeMeeting = meetings.find((m) => m.status === 'เปิดเช็คชื่อ') || meetings[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dateStr.trim()) {
      alert('กรุณากรอกชื่อหัวข้อและวันเวลาประชุม');
      return;
    }

    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      title: formData.title,
      dateStr: formData.dateStr,
      timeStr: formData.timeStr,
      location: formData.location,
      pointsReward: Number(formData.pointsReward) || 10,
      presentCount: 0,
      totalMembers: totalMembersCount,
      status: 'ร่าง',
      type: 'monthly'
    };

    onAddMeeting(newMeeting);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#131b2e] tracking-tight font-headline">ประชุมประจำเดือน</h2>
          <p className="text-sm font-semibold text-[#7a7489]">การบันทึกจัดเตรียมการประชุม และจัดการลงทะเบียนสมาชิกเพื่อรับคะแนนสะสม</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#0f766e] text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#0ea5e9] transition-colors shadow-lg shadow-[#0f766e]/20 hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined text-base">post_add</span>
          กำหนดประชุมใหม่
        </button>
      </div>

      {/* ACTIVE MEETING FOCUS CARD */}
      {activeMeeting && (
        <section className="bg-white rounded-[2rem] border-2 border-[#0f766e]/30 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 shrink-0">
            <span className="bg-[#0f766e] text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
              ระเบียบวาระล่าสุด
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#0f766e] tracking-widest uppercase mb-1">
                <span className="material-symbols-outlined text-base">emergency_home</span>
                ชุมชนบ้านฉลีก หมู่ที่ 5
              </div>
              <h3 className="text-2xl font-black font-headline text-[#131b2e]">{activeMeeting.title}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-[#494457]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7a7489]">calendar_today</span>
                  <span>{activeMeeting.dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7a7489]">schedule</span>
                  <span>{activeMeeting.timeStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7a7489]">location_on</span>
                  <span>{activeMeeting.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0f766e] font-bold">stars</span>
                  <span className="text-[#0f766e]">คะแนนเข้าร่วม +{activeMeeting.pointsReward} แต้มสะสม</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-teal-50/50 p-6 rounded-2xl border border-[#cac3da]/40 flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-xs font-black text-[#7a7489] uppercase tracking-wider">อัตราการเช็คชื่อเข้าใช้งาน</span>
                  <span className="text-sm font-black text-[#0f766e]">
                    {activeMeeting.presentCount || 312} / {totalMembersCount} คน Registered
                  </span>
                </div>
                <div className="w-full bg-teal-100/50 h-3.5 rounded-full overflow-hidden p-0.5 border border-[#cac3da]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#0f766e] to-[#0ea5e9] rounded-full"
                    style={{ width: `${Math.round(((activeMeeting.presentCount || 312) / totalMembersCount) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => onNavigateToCheckin(activeMeeting.id)}
                className="w-full py-3 bg-[#0f766e] text-white hover:bg-[#0ea5e9] rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-[#0f766e]/20"
              >
                <span className="material-symbols-outlined text-lg">event_available</span>
                เข้าสู่โหมดเช็คชื่อทันที
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MEETINGS TABLE HISTORIES */}
      <section className="bg-white border border-[#cac3da]/50 rounded-[2rem] overflow-hidden shadow-lg">
        <div className="p-6 border-b border-[#cac3da]/30 bg-slate-50 flex items-center justify-between">
          <h3 className="text-base font-black font-headline text-[#131b2e] flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">history</span>
            ประวัติการประชุมย้อนหลัง
          </h3>
          <span className="text-xs font-semibold text-[#7a7489]">{meetings.length} รายการประชุมที่เข้าระบบ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-teal-50/50 text-[10px] font-black text-[#7a7489] uppercase tracking-widest border-b border-[#cac3da]/40">
                <th className="px-6 py-4.5">ชื่องานประชุม / หัวข้อวาระ</th>
                <th className="px-6 py-4.5">วันที่ดำเนินการ</th>
                <th className="px-6 py-4.5">สถานที่</th>
                <th className="px-6 py-4.5 text-center">เข้าประชุม</th>
                <th className="px-6 py-4.5 text-center">คะแนนรางวัล</th>
                <th className="px-6 py-4.5 text-center">สถานะ</th>
                <th className="px-6 py-4.5 text-center">ข้อมูลรายงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cac3da]/30">
              {meetings.map((meet) => {
                const attended = meet.presentCount || 312;
                const missed = totalMembersCount - attended;
                const percent = Math.round((attended / totalMembersCount) * 100);

                return (
                  <tr key={meet.id} className="hover:bg-teal-50/20 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-[#131b2e] block">{meet.title}</span>
                      <span className="text-[10px] text-[#7a7489] font-bold">เทอมการสะสมแต้ม • ระบบดิจิทัล</span>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-[#494457]">{meet.dateStr}</td>
                    <td className="px-6 py-5 text-sm font-bold text-[#494457]">{meet.location}</td>
                    <td className="px-6 py-5 text-center">
                      <div>
                        <span className="text-sm font-black text-[#131b2e]">{attended}</span>
                        <span className="text-xs font-bold text-[#7a7489] ml-1">({percent}%)</span>
                      </div>
                      <span className="text-[9px] font-bold text-[#ba1a1a]">ขาดประชุม {missed} คน</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-teal-50 text-[#0f766e] text-xs font-black px-3 py-1 rounded-full border border-teal-500/20">
                        +{meet.pointsReward} แต้ม
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`status-badge text-[11px] font-extrabold px-3 py-1 ${
                          meet.status === 'เสร็จสิ้น'
                            ? 'bg-[#1ced7c]/20 text-[#004b22] border border-[#1ced7c]/40'
                            : meet.status === 'เปิดเช็คชื่อ'
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}
                      >
                        {meet.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => alert(`คัดลอก และดาวน์โหลดรายงานสรุป ${meet.title} สำเร็จ (CSV Format)`)}
                        className="p-1 px-3 border border-[#cac3da] hover:bg-[#0f766e] hover:text-white rounded-lg text-xs font-bold transition-all text-[#0f766e]"
                      >
                        รายงาน CSV
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* MEETING NEW MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#cac3da] shadow-2xl">
            <h3 className="text-xl font-black font-headline text-[#131b2e] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f766e] font-bold">event</span> สร้างกำหนดประชุมใหม่
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">หัวข้อวาระการประชุม</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น ประชุมสัญจรคุ้มไทรงาม ครั้งที่ 2"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">วันที่จัดประชุม (ภาษาไทย)</label>
                <input
                  type="text"
                  required
                  value={formData.dateStr}
                  onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                  placeholder={`เช่น วันเสาร์ที่ 12 กรกฎาคม ${getCurrentThaiYear()}`}
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
                  <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">คะแนนสะสมที่จะแจก</label>
                  <input
                    type="number"
                    value={formData.pointsReward}
                    onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#7a7489] uppercase mb-1">สถานที่ประชุม</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                />
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
                  เปิดร่างระเบียบประชุม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
