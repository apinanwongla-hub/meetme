import React, { useState, useEffect } from 'react';
import { Member, Meeting, Cluster } from '../types';

interface CheckInProps {
  members: Member[];
  meetings: Meeting[];
  clusters: Cluster[];
  onSaveCheckIn: (meetingId: string, checkedMemberIds: string[]) => void;
}

export default function CheckIn({
  members,
  meetings,
  clusters,
  onSaveCheckIn
}: CheckInProps) {
  // Active meeting selection state
  const openOrDraftMeetings = meetings.filter((m) => m.status !== 'เสร็จสิ้น');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');

  useEffect(() => {
    if (openOrDraftMeetings.length > 0 && !selectedMeetingId) {
      setSelectedMeetingId(openOrDraftMeetings[0].id);
    } else if (meetings.length > 0 && !selectedMeetingId) {
      setSelectedMeetingId(meetings[0].id);
    }
  }, [meetings, openOrDraftMeetings, selectedMeetingId]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('ALL');

  // Record checked states
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const activeMeeting = meetings.find((m) => m.id === selectedMeetingId);

  // Initialize checks (all false or load default)
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    members.forEach((m) => {
      initial[m.id] = false;
    });
    setCheckedIds(initial);
  }, [members, selectedMeetingId]);

  // Find members based on active search
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.houseNo.includes(searchTerm);
    const matchesCluster = clusterFilter === 'ALL' || m.clusterId === Number(clusterFilter);
    return matchesSearch && matchesCluster;
  });

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    const updated = { ...checkedIds };
    filteredMembers.forEach((m) => {
      updated[m.id] = checked;
    });
    setCheckedIds(updated);
  };

  const activeCheckedCount = Object.values(checkedIds).filter(Boolean).length;

  const handleSave = () => {
    if (!selectedMeetingId) {
      alert('กรุณาเลือกงานประชุมก่อนดำเนิการ');
      return;
    }
    const idsToSave = Object.keys(checkedIds).filter((id) => checkedIds[id]);
    if (idsToSave.length === 0) {
      if (!confirm('ต้องการส่งฟอร์มโดยไม่มีสมาชิกคนใดมาประชุมเลยใช่หรือไม่?')) {
        return;
      }
    }

    onSaveCheckIn(selectedMeetingId, idsToSave);
    alert('บันทึกข้อมูลและร่วมบวกแต้มแจกจ่ายแก่ผู้เข้าร่วมสำเร็จแล้ว!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#131b2e] tracking-tight font-headline">ระบบเช็คชื่อสะสมแต้ม</h2>
          <p className="text-sm font-semibold text-[#7a7489]">ติ๊กเครื่องหมายเช็คถูกชื่อสมาชิกที่มาประชุม ดำเนินการบวกแต้มเข้ากระเป๋าสมาชิกโดยตรงแยกรายคุ้ม</p>
        </div>
      </div>

      <div className="bg-white p-6 border border-[#cac3da]/50 rounded-[2rem] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        {/* Choose Meeting Dropdown */}
        <div className="lg:col-span-4">
          <label className="block text-xs font-black text-[#7a7489] uppercase mb-1.5">เลือกหัวข้อการประชุม</label>
          <select
            value={selectedMeetingId}
            onChange={(e) => setSelectedMeetingId(e.target.value)}
            className="w-full rounded-xl border border-[#cac3da] bg-white text-sm font-bold focus:ring-[#0f766e] focus:border-[#0f766e] h-11 cursor-pointer"
          >
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.status})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Cluster */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-black text-[#7a7489] uppercase mb-1.5">กรองเฉพาะคุ้ม</label>
          <select
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
            className="w-full rounded-xl border border-[#cac3da] bg-white text-sm font-bold focus:ring-[#0f766e] focus:border-[#0f766e] h-11 cursor-pointer"
          >
            <option value="ALL">ทุกคุ้มสมาชิก</option>
            {clusters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.startsWith('คุ้ม') ? c.name : `คุ้ม ${c.id} - ${c.name}`}
              </option>
            ))}
          </select>
        </div>

        {/* Search by Name */}
        <div className="lg:col-span-5 relative">
          <label className="block text-xs font-black text-[#7a7489] uppercase mb-1.5">พิมพ์ค้นหา (ชื่อ / เลขที่บ้าน)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-[#7a7489]">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#cac3da] bg-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0f766e] h-11"
              placeholder="ค้นหาชื่อ-สกุล หรือ เลขห้อง..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#cac3da]/50 rounded-[2rem] overflow-hidden shadow-lg">
        {/* Bulk Action Header bar */}
        <div className="px-8 py-5 bg-teal-50/50 border-b border-[#cac3da]/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                id="checkbox-all"
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-5 h-5 text-[#0f766e] rounded border-[#cac3da] focus:ring-[#0f766e]"
              />
              <label htmlFor="checkbox-all" className="text-sm font-black text-[#131b2e] cursor-pointer selection:bg-transparent">
                เลือกสมาชิกทั้งหมดในหน้านี้
              </label>
            </div>
            
            {activeMeeting && (
              <div className="text-xs font-bold text-[#7a7489]">
                คะแนนรางวัลที่จะได้รับ: <span className="text-[#0f766e] font-extrabold">+{activeMeeting.pointsReward} แต้ม</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[#494457]">
              เลือกแล้ว <span className="text-[#0f766e] font-black text-lg">{activeCheckedCount}</span> คน
            </span>
            <button
              onClick={handleSave}
              className="bg-[#006631] text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-[#004b22] transition-colors shadow-lg shadow-emerald-700/20"
            >
              <span className="material-symbols-outlined text-base font-bold">check_circle</span>
              บันทึกเช็คชื่อ & บวกแต้มสะสม
            </button>
          </div>
        </div>

        {/* Member Check Cards Grid */}
        <div className="p-8 max-h-[500px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#f8fafc]/50">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((m) => {
              const isChecked = !!checkedIds[m.id];
              const cName = clusters.find((c) => c.id === m.clusterId)?.name || 'คุ้ม';

              return (
                <div
                  key={m.id}
                  onClick={() => toggleCheck(m.id)}
                  className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'border-[#0f766e] bg-teal-50/30 shadow-md shadow-[#0f766e]/5'
                      : 'border-[#cac3da]/40 bg-white hover:border-[#cac3da]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isChecked ? 'bg-[#0f766e] border-[#0f766e]' : 'border-[#cac3da]'
                      }`}
                    >
                      {isChecked && <span className="material-symbols-outlined text-white text-base font-black">check</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#131b2e] truncate">{m.name}</p>
                      <p className="text-[10px] font-bold text-[#7a7489]">
                        {cName.startsWith('คุ้ม') ? cName : `คุ้ม ${m.clusterId} (${cName})`} • บ้าน {m.houseNo}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black bg-teal-50/50 border border-teal-500/20 px-2.5 py-1 rounded-full text-[#0f766e] block">
                      {m.points} แต้มเดิม
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-[#7a7489] font-bold text-sm bg-white rounded-2xl border border-dashed border-[#cac3da]">
              ⚠️ ไม่พบข้อมูลคุ้มหรือรายชื่อสอดคล้องตามตัวกรอง
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
