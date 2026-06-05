import React, { useState } from 'react';
import { Cluster, Member } from '../types';

interface ClustersProps {
  clusters: Cluster[];
  members: Member[];
}

export default function Clusters({ clusters, members }: ClustersProps) {
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // Filter members of selected cluster
  const clusterMembers = selectedClusterId
    ? members.filter((m) => m.clusterId === selectedClusterId)
    : [];

  const filteredClusterMembers = clusterMembers.filter((m) => {
    return m.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      m.houseNo.includes(memberSearchTerm);
  });

  const selectedCluster = clusters.find((c) => c.id === selectedClusterId);

  // Custom border/color styling for the 11 Zones matching original CSS presets
  const clusterConfigs: Record<number, { border: string; bgLeft: string; pillColor: string }> = {
    1: { border: 'border-teal-500/20 hover:border-teal-500', bgLeft: 'bg-teal-500', pillColor: 'bg-teal-500' },
    2: { border: 'border-[#00e475]/20 hover:border-[#00e475]', bgLeft: 'bg-[#00e475]', pillColor: 'bg-[#00e475] text-[#00210b]' },
    3: { border: 'border-purple-500/20 hover:border-purple-500', bgLeft: 'bg-purple-500', pillColor: 'bg-purple-500' },
    4: { border: 'border-orange-500/20 hover:border-orange-500', bgLeft: 'bg-orange-500', pillColor: 'bg-orange-500' },
    5: { border: 'border-teal-500/20 hover:border-teal-500', bgLeft: 'bg-teal-500', pillColor: 'bg-teal-500' },
    6: { border: 'border-rose-500/20 hover:border-rose-500', bgLeft: 'bg-rose-500', pillColor: 'bg-rose-500' },
    7: { border: 'border-blue-600/20 hover:border-blue-600', bgLeft: 'bg-blue-600', pillColor: 'bg-blue-600' },
    8: { border: 'border-lime-500/20 hover:border-lime-500', bgLeft: 'bg-lime-500', pillColor: 'bg-lime-500 text-[#131b2e]' },
    9: { border: 'border-orange-600/20 hover:border-orange-600', bgLeft: 'bg-orange-600', pillColor: 'bg-orange-600' },
    10: { border: 'border-indigo-600/20 hover:border-indigo-600', bgLeft: 'bg-indigo-600', pillColor: 'bg-indigo-600' },
    11: { border: 'border-emerald-500/20 hover:border-emerald-500', bgLeft: 'bg-emerald-500', pillColor: 'bg-emerald-500' }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#131b2e] tracking-tight font-headline">เขตแบ่ง 11 คุ้ม</h2>
          <p className="text-sm font-semibold text-[#7a7489]">แผนผังรายคุ้ม เขตบ้านฉลีก หมู่ที่ 5 แสดงสัดส่วนและความหนาแน่นของสมาชิก</p>
        </div>
        <div className="px-5 py-2 bg-teal-50 text-[#0f766e] rounded-full text-sm font-black border border-teal-500/20">
          {members.length} สมาชิกทั้งหมด
        </div>
      </div>

      {/* Main Grid mapping to the original layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clusters.map((cluster) => {
          const config = clusterConfigs[cluster.id] || {
            border: 'border-slate-200 hover:border-[#0f766e]',
            bgLeft: 'bg-[#0f766e]',
            pillColor: 'bg-[#0f766e]'
          };

          // Count members inside this cluster
          const membersInThisCluster = members.filter(m => m.clusterId === cluster.id).length;

          // Compute SVG circular dash value
          const radius = 24;
          const stroke = 5;
          const normalizedRadius = radius - stroke * 2;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDashoffset = circumference - (cluster.attendancePercentage / 100) * circumference;

          return (
            <div
              key={cluster.id}
              onClick={() => {
                setSelectedClusterId(cluster.id);
                setMemberSearchTerm('');
              }}
              className={`group border-2 ${config.border} rounded-3xl p-5 bg-white flex flex-col gap-6 relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${config.bgLeft}`}></div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-4xl font-extrabold text-[#0f766e] block leading-none font-headline group-hover:scale-105 transition-transform">
                    {cluster.id}
                  </span>
                  <span className="text-lg font-bold text-[#131b2e] block mt-1">{cluster.name}</span>
                  <span className="text-[10px] text-[#7a7489] font-bold block mt-0.5">หัวหน้า: {cluster.leaderName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="bg-teal-50 px-3 py-2 rounded-xl text-center min-w-[4rem] border border-teal-500/10">
                  <span className="text-lg font-black text-[#0f766e] block">{membersInThisCluster}</span>
                  <span className="text-[10px] text-[#7a7489] font-black uppercase tracking-tighter">สมาชิก</span>
                </div>

                {/* Circular Percentage Donut */}
                <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-teal-100"
                      cx="28"
                      cy="28"
                      fill="transparent"
                      r={normalizedRadius}
                      stroke="currentColor"
                      strokeWidth={stroke}
                    />
                    <circle
                      className="text-[#0f766e]"
                      cx="28"
                      cy="28"
                      fill="transparent"
                      r={normalizedRadius}
                      stroke="currentColor"
                      strokeDasharray={circumference + ' ' + circumference}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      strokeWidth={stroke}
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-[#0f766e]">{cluster.attendancePercentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL DRAWER / OVERLAY FOR SELECTED CLUSTER MEMBERS */}
      {selectedClusterId !== null && selectedCluster && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end z-50 p-0 transition-opacity">
          <div className="bg-white h-screen max-w-lg w-full shadow-2xl p-8 overflow-y-auto flex flex-col justify-between border-l border-[#cac3da] animate-slide-in">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  {!selectedCluster.name.startsWith('คุ้ม') && (
                    <span className="text-4xl font-headline font-black text-[#0f766e]">คุ้ม {selectedCluster.id}</span>
                  )}
                  <h3 className="text-2xl font-extrabold text-[#131b2e]">{selectedCluster.name}</h3>
                  <p className="text-xs text-[#7a7489] font-bold mt-1">
                    ผู้ดูแล/หัวหน้าคุ้ม: <span className="text-[#0f766e]">{selectedCluster.leaderName}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedClusterId(null);
                    setMemberSearchTerm('');
                  }}
                  className="w-10 h-10 rounded-full border border-[#cac3da] flex items-center justify-center hover:bg-teal-50 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Cluster stats recap */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50/50 p-4 rounded-2xl text-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#7a7489]">สมาชิกในคุ้ม</span>
                  <p className="text-2xl font-black text-[#0f766e]">{clusterMembers.length} คน</p>
                </div>
                <div className="bg-teal-50/50 p-4 rounded-2xl text-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#7a7489]">อัตราการร่วมประชุม</span>
                  <p className="text-2xl font-black text-[#006631]">{selectedCluster.attendancePercentage}%</p>
                </div>
              </div>

              {/* Search Member/House inside cluster */}
              <div className="relative mb-5">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-[#7a7489]">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input
                  type="text"
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                  placeholder="ค้นหาชื่อลูกบ้าน หรือเลขที่บ้านในคุ้มนี้..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-[#cac3da] bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent transition-all placeholder:text-[#7a7489]/70"
                />
                {memberSearchTerm && (
                  <button
                    onClick={() => setMemberSearchTerm('')}
                    className="absolute inset-y-0 right-3.5 flex items-center text-[#7a7489] hover:text-[#ba1a1a] transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>

              {/* Members List inside this cluster */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-black uppercase text-[#131b2e] tracking-widest">ข้อมูลทำเนียบรายชื่อ</h4>
                {memberSearchTerm && (
                  <span className="text-[10px] bg-teal-50 text-[#0f766e] px-2.5 py-1 rounded-full font-bold">
                    พบ {filteredClusterMembers.length} คน
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {filteredClusterMembers.length > 0 ? (
                  filteredClusterMembers.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl border border-[#cac3da]/40 hover:border-teal-500/30 hover:bg-teal-50/40 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f766e] flex items-center justify-center text-xs font-black">
                          {m.id}
                        </div>
                        <div>
                          <div className="text-sm font-black text-[#131b2e]">{m.name}</div>
                          <div className="text-xs text-[#7a7489]">บ้านเลขที่ {m.houseNo} • {m.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#0f766e] font-black text-sm block">{m.points} แต้ม</span>
                        <span className="text-[9px] text-[#7a7489] font-bold">เข้าเรียน {m.meetingAttended}/{m.meetingTotal}</span>
                      </div>
                    </div>
                  ))
                ) : clusterMembers.length > 0 ? (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-[#cac3da]/30">
                    <span className="material-symbols-outlined text-3xl text-[#7a7489]/50 animate-bounce">search</span>
                    <p className="text-xs font-bold text-[#7a7489] mt-2">ไม่พบลูกบ้านตามคำค้นหา</p>
                    <p className="text-[10px] text-[#7a7489]/70 mt-1">โปรดพิมพ์คำค้นหาชื่อหรือเลขที่บ้านใหม่อีกครั้ง</p>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#7a7489] py-8 text-center bg-slate-50 rounded-2xl">
                    ไม่มีสมาชิกที่บันทึกข้อมูลในคุ้มนี้
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex mt-6">
              <button
                onClick={() => {
                  setSelectedClusterId(null);
                  setMemberSearchTerm('');
                }}
                className="w-full py-3 bg-[#0f766e] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#0d9488]"
              >
                เสร็จสิ้น / ปิดหน้าจอ
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
