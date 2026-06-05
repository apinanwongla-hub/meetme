import React, { useState } from 'react';
import { Member, Cluster } from '../types';
import { getThaiMonthName, getBuddhistEraYear } from '../utils/dateUtils';

interface MembersProps {
  members: Member[];
  clusters: Cluster[];
  onAddMember: (newMember: Member) => void;
  onUpdateMember: (updatedMember: Member) => void;
  onDeleteMember: (id: string) => void;
}

export default function Members({
  members,
  clusters,
  onAddMember,
  onUpdateMember,
  onDeleteMember
}: MembersProps) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    houseNo: '',
    clusterId: '1',
    role: 'สมาชิก' as 'หัวหน้าคุ้ม' | 'สมาชิก',
    status: 'ปกติ' as 'ปกติ' | 'พักงาน' | 'ขาดบ่อย',
    points: '0'
  });

  // Filtered list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.houseNo.includes(searchTerm);
    const matchesCluster = clusterFilter === 'ALL' || m.clusterId === Number(clusterFilter);
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesCluster && matchesStatus;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      houseNo: '',
      clusterId: '1',
      role: 'สมาชิก',
      status: 'ปกติ',
      points: '0'
    });
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.houseNo.trim()) {
      alert('กรุณากรอกชื่อและเลขที่บ้าน');
      return;
    }

    const newId = String(members.length + 1).padStart(3, '0');
    const newMember: Member = {
      id: newId,
      name: formData.name,
      houseNo: formData.houseNo,
      clusterId: Number(formData.clusterId),
      role: formData.role,
      status: formData.status,
      meetingAttended: 0,
      meetingTotal: 12,
      activityCount: 0,
      points: Number(formData.points) || 0
    };

    onAddMember(newMember);
    setIsAddOpen(false);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      houseNo: m.houseNo,
      clusterId: String(m.clusterId),
      role: m.role,
      status: m.status,
      points: String(m.points)
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!formData.name.trim() || !formData.houseNo.trim()) {
      alert('กรุณากรอกชื่อและเลขที่บ้าน');
      return;
    }

    const updated: Member = {
      ...editingMember,
      name: formData.name,
      houseNo: formData.houseNo,
      clusterId: Number(formData.clusterId),
      role: formData.role,
      status: formData.status,
      points: Number(formData.points) || 0
    };

    onUpdateMember(updated);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section with KPIs */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-extrabold text-[#131b2e] tracking-tight font-headline">รายชื่อสมาชิก</h2>
            <span className="text-[11px] px-3 py-1 bg-[#006631] text-[#62ff96] font-bold rounded-full uppercase tracking-wider shadow-sm">Live</span>
          </div>
          <p className="text-sm font-semibold text-[#7a7489]">{getThaiMonthName()} {getBuddhistEraYear()} • ทะเบียนสมาชิกชุมชนบ้านฉลีก หมู่ที่ 5 ({members.length} คน)</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#0f766e] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#0d9488] transition-all shadow-lg shadow-[#0f766e]/30 hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          เพิ่มสมาชิกใหม่
        </button>
      </div>

      {/* Filter Section  */}
      <div className="bg-teal-50/40 p-6 rounded-t-2xl border border-[#cac3da]/50 border-b-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search box */}
          <div className="lg:col-span-5 relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-[#7a7489]">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#cac3da] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent transition-all"
              placeholder="ค้นหาชื่อ-สกุล หรือเลขที่บ้าน..."
            />
          </div>

          {/* Cluster filter */}
          <div className="lg:col-span-3">
            <select
              value={clusterFilter}
              onChange={(e) => {
                setClusterFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-[#cac3da] bg-white text-sm font-bold focus:ring-[#0f766e] focus:border-[#0f766e] h-[42px] cursor-pointer"
            >
              <option value="ALL">ทุกคุ้มสมาชิก (All)</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.startsWith('คุ้ม') ? c.name : `คุ้ม ${c.id} - ${c.name}`}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-[#cac3da] bg-white text-sm font-bold focus:ring-[#0f766e] focus:border-[#0f766e] h-[42px] cursor-pointer"
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value="ปกติ">ปกติ / เข้าร่วม</option>
              <option value="พักงาน">พักงาน</option>
              <option value="ขาดบ่อย">ขาดบ่อย</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setClusterFilter('ALL');
                setStatusFilter('ALL');
                setCurrentPage(1);
              }}
              className="w-full bg-[#cd4800] text-white h-[42px] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#a33800] transition-all"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              ล้างตัวกรอง
            </button>
          </div>

        </div>
      </div>

      {/* Grid of Results / Table */}
      <div className="bg-white border border-[#cac3da]/50 rounded-b-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-teal-50/40 text-[11px] font-black text-[#7a7489] uppercase tracking-widest border-b border-[#cac3da]/50">
                <th className="px-6 py-5">No.</th>
                <th className="px-6 py-5">ชื่อ-นามสกุล</th>
                <th className="px-6 py-5">คุ้ม</th>
                <th className="px-6 py-5">บ้านเลขที่</th>
                <th className="px-6 py-5">เข้าประชุม/ปี</th>
                <th className="px-6 py-5">คะแนนสะสม</th>
                <th className="px-6 py-5">สถานะ</th>
                <th className="px-6 py-5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cac3da]/30">
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member, index) => {
                  const matchingCluster = clusters.find((c) => c.id === member.clusterId);
                  const statusBadgeClass =
                    member.status === 'ปกติ'
                      ? 'status-normal'
                      : member.status === 'พักงาน'
                      ? 'status-leave'
                      : 'status-absent';

                  return (
                    <tr key={member.id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-[#7a7489]">{startIndex + index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0f766e]/10 text-[#0f766e] flex items-center justify-center text-xs font-black shadow-inner">
                            {member.name.substring(3, 5)}
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#131b2e]">{member.name}</div>
                            <div className="text-[9px] font-black text-[#0f766e] uppercase">{member.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-[#494457]">
                          {matchingCluster?.name ? (matchingCluster.name.startsWith('คุ้ม') ? matchingCluster.name : `คุ้ม ${member.clusterId} - ${matchingCluster.name}`) : `คุ้ม ${member.clusterId}`}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#131b2e]">{member.houseNo}</td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-[#004b22]">
                          {member.meetingAttended}/{member.meetingTotal} ครั้ง
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-[#0f766e]">
                          {member.points.toLocaleString()} <span className="text-[10px] font-normal text-[#7a7489] ml-1">แต้ม</span>
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`status-badge ${statusBadgeClass}`}>{member.status}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 text-[#0f766e] hover:bg-[#0f766e] hover:text-white border border-[#0f766e]/20 rounded-lg transition-all"
                            title="แก้ไขข้อมูล"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบคุณ ${member.name} ออกจากระบบทะเบียนใช่หรือไม่?`)) {
                                onDeleteMember(member.id);
                              }
                            }}
                            className="p-1.5 text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white border border-[#ba1a1a]/20 rounded-lg transition-all"
                            title="ลบสมาชิก"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#7a7489] font-bold text-sm">
                    ⚠️ ไม่พบสมาชิกตามเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-5 flex items-center justify-between bg-[#f8fafc]">
          <p className="text-xs font-bold text-[#7a7489]">
            แสดง <span className="text-[#0f766e] font-extrabold">{paginatedMembers.length}</span> จากทั้งหมด{' '}
            <span className="text-[#131b2e] font-extrabold">{filteredMembers.length} รายการ</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#cac3da] text-[#7a7489] bg-white hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined text-lg font-bold">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  currentPage === p
                    ? 'bg-[#0f766e] text-white shadow-md shadow-[#0f766e]/20'
                    : 'border border-[#cac3da] bg-white text-[#494457] hover:bg-[#f1f5f9]'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#cac3da] text-[#7a7489] bg-white hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined text-lg font-bold">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* DIALOG NEW MEMBER (Add Open) */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#cac3da] shadow-2xl relative">
            <h3 className="text-xl font-black font-headline text-[#131b2e] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f766e] font-bold">person_add</span> Add New Member
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น นายมานะ เฝ้ารักษ์"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">บ้านเลขที่</label>
                  <input
                    type="text"
                    required
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    placeholder="เช่น 14/2"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">คะแนนเริ่มต้น</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">สังกัดคุ้ม</label>
                  <select
                    value={formData.clusterId}
                    onChange={(e) => setFormData({ ...formData, clusterId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  >
                    {clusters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.startsWith('คุ้ม') ? c.name : `คุ้ม ${c.id} - ${c.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">บทบาท</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  >
                    <option value="สมาชิก">สมาชิก</option>
                    <option value="หัวหน้าคุ้ม">หัวหน้าคุ้ม</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                >
                  <option value="ปกติ">ปกติ / เข้าร่วม</option>
                  <option value="พักงาน">พักงาน (ชั่วคราว)</option>
                  <option value="ขาดบ่อย">ขาดบ่อย (ต้องติดตาม)</option>
                </select>
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
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG EDIT MEMBER (Edit Open) */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#cac3da] shadow-2xl relative">
            <h3 className="text-xl font-black font-headline text-[#131b2e] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f766e] font-bold">edit</span> Edit Member Information
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">บ้านเลขที่</label>
                  <input
                    type="text"
                    required
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">คะแนนสะสม</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">สังกัดคุ้ม</label>
                  <select
                    value={formData.clusterId}
                    onChange={(e) => setFormData({ ...formData, clusterId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  >
                    {clusters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.startsWith('คุ้ม') ? c.name : `คุ้ม ${c.id} - ${c.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">บทบาท</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                  >
                    <option value="สมาชิก">สมาชิก</option>
                    <option value="หัวหน้าคุ้ม">หัวหน้าคุ้ม</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#7a7489] uppercase mb-1">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#cac3da] text-sm focus:ring-2 focus:ring-[#0f766e] outline-none"
                >
                  <option value="ปกติ">ปกติ / เข้าร่วม</option>
                  <option value="พักงาน">พักงาน (ชั่วคราว)</option>
                  <option value="ขาดบ่อย">ขาดบ่อย (ต้องติดตาม)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#494457] text-sm font-bold transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#0ea5e9] text-white text-sm font-bold transition-all shadow-md shadow-[#0f766e]/20"
                >
                  อัปเดตข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
