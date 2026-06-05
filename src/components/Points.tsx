import React, { useState } from 'react';
import { Member, Cluster } from '../types';

interface PointsProps {
  members: Member[];
  clusters: Cluster[];
}

export default function Points({ members, clusters }: PointsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('ALL');

  // Compute stats
  const totalPoints = members.reduce((sum, b) => sum + b.points, 0);
  const targetPoints = 60000;
  const targetPercent = Math.min(100, Math.round((totalPoints / targetPoints) * 100));

  // Sort candidates by score descending
  const sortedMembers = [...members]
    .filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.houseNo.includes(searchTerm);
      const matchesCluster = clusterFilter === 'ALL' || m.clusterId === Number(clusterFilter);
      return matchesSearch && matchesCluster;
    })
    .sort((a, b) => b.points - a.points);

  const handleExportCSV = () => {
    // Generate actual valid CSV format
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'Ranking,Name,Cluster,HouseNo,AttendedCount,Points\n';

    sortedMembers.forEach((m, idx) => {
      const cName = clusters.find((c) => c.id === m.clusterId)?.name || 'คุ้ม';
      csvContent += `${idx + 1},"${m.name}","คุ้ม ${m.clusterId} - ${cName}","${m.houseNo}",${m.meetingAttended},${m.points}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `บ้านฉลีก_หมู่ที่5_รายชื่อคะแนนสะสม_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* TARGET & PROGRESS ROADMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progress metric box (col-span-8) */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#0f766e] to-[#0ea5e9] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full -mr-12 -mt-12 pointer-events-none"></div>
          
          <div className="space-y-2 mb-8">
            <span className="bg-[#00e475]/20 text-teal-200 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-teal-200/30">
              เป้าหมายเงินสมทบประจำปี
            </span>
            <h3 className="text-2xl font-black font-headline mt-2">ยอดแต้มสะสมรวมทั้งหมู่บ้าน</h3>
            <p className="text-xs text-white/75 font-semibold">
              ช่วยบวกแต้มเข้าส่วนกลางเพื่ออัปเกรดงบสนับสนุนจากโครงการรัฐ สำหรับสิ่งแวดล้อมและสาธารณูปโภคร่วมกัน
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            <div>
              <span className="text-[10px] text-white/70 block uppercase font-black">คะแนนสะสมขณะนี้</span>
              <p className="text-3xl font-black">{totalPoints.toLocaleString()} <span className="text-sm font-bold text-teal-200">pts</span></p>
            </div>
            <div>
              <span className="text-[10px] text-white/70 block uppercase font-black">เป้าหมายงบกลาง</span>
              <p className="text-3xl font-black opacity-90">60,000 <span className="text-sm font-bold">pts</span></p>
            </div>
            <div>
              <span className="text-[10px] text-white/70 block uppercase font-black">ความสำเร็จของปีนี้</span>
              <p className="text-3xl font-black text-teal-200">{targetPercent}%</p>
            </div>
          </div>

          {/* Large dynamic bar */}
          <div className="mt-6 w-full bg-white/20 h-4 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full shadow-[0_0_8px_rgba(94,234,212,0.5)]"
              style={{ width: `${targetPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Circular Radial Gauge Box (col-span-4) */}
        <div className="lg:col-span-4 bg-white p-6 border border-[#cac3da]/50 rounded-[2rem] shadow-lg flex flex-col justify-center items-center gap-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-teal-50"
                cx="64"
                cy="64"
                fill="transparent"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
              />
              <circle
                className="text-[#0f766e]"
                cx="64"
                cy="64"
                fill="transparent"
                r="50"
                stroke="currentColor"
                strokeDasharray="314.16 314.16"
                style={{ strokeDashoffset: 314.16 - (targetPercent / 100) * 314.16 }}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="absolute text-center bg-white rounded-full w-24 h-24 flex flex-col justify-center shadow-lg border border-slate-100">
              <span className="text-2xl font-black text-[#0f766e] leading-none">{targetPercent}%</span>
              <span className="text-[9px] font-black text-[#7a7489] uppercase tracking-wider mt-1">อันดับร่วม</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#131b2e] bg-teal-50 px-4 py-1.5 rounded-full border">
            บ้านฉลีก ร่วมขับเคลื่อนสู่ความสามัคคีสูงสุด!
          </span>
        </div>

      </div>

      {/* DETAILED RANKING LEADERBOARD */}
      <section className="bg-white border border-[#cac3da]/50 rounded-[2rem] overflow-hidden shadow-lg">
        <div className="p-6 border-b border-[#cac3da]/30 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black font-headline text-[#131b2e]">ตารางคะแนนสะสมรายครัวเรือน</h3>
            <p className="text-xs text-[#7a7489] font-bold mt-0.5">รวมประวัติการรับแต้มจากการเข้าร่วมกิจกรรมและเช็คชื่อ</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-white border border-[#cac3da] rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-[#0f766e] min-w-[150px] w-full"
              placeholder="ค้นหาตามชื่อสกุล..."
            />
            
            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-[#cac3da] rounded-xl text-xs font-bold focus:ring-[#0f766e] cursor-pointer"
            >
              <option value="ALL">ทุกคุ้มสมาชิก</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.startsWith('คุ้ม') ? c.name : `คุ้ม ${c.id} - ${c.name}`}
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="bg-[#006631] hover:bg-[#004b22] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <span className="material-symbols-outlined text-sm font-bold">download</span>
              ส่งออก CSV
            </button>
          </div>
        </div>

        {/* RANK LIST TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-teal-50/50 text-[10px] font-black text-[#7a7489] uppercase tracking-widest border-b border-[#cac3da]/40">
                <th className="px-6 py-4.5 text-center w-20">อันดับ</th>
                <th className="px-6 py-4.5">ชื่อ-สกุล สมาชิก</th>
                <th className="px-6 py-4.5">สังกัดคุ้ม</th>
                <th className="px-6 py-4.5 text-center">บ้านเลขที่</th>
                <th className="px-6 py-4.5 text-center">เข้าประชุม</th>
                <th className="px-6 py-4.5 text-right pr-12">คะแนนสะสม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cac3da]/30">
              {sortedMembers.map((member, idx) => {
                const isTopThree = idx < 3;
                const badges = [
                  'bg-amber-100 text-[#a33800] border-amber-300 font-black',
                  'bg-slate-100 text-slate-700 border-slate-300 font-bold',
                  'bg-orange-50 text-orange-700 border-orange-200 font-bold'
                ];

                const matchingCluster = clusters.find((c) => c.id === member.clusterId);

                return (
                  <tr key={member.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="px-6 py-4 text-center">
                      {isTopThree ? (
                        <span className={`status-badge text-[10px] px-3.5 py-1 rounded-full border ${badges[idx]}`}>
                          #{idx + 1}
                        </span>
                      ) : (
                        <span className="text-sm font-black text-[#7a7489]">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-black text-[#131b2e]">{member.name}</span>
                        {idx === 0 && <span className="text-lg leading-none">👑</span>}
                        {member.role === 'หัวหน้าคุ้ม' && (
                          <span className="text-[8px] bg-[#0f766e] text-white px-1.5 py-0.5 rounded font-black uppercase">
                            Leader
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-[#494457]">
                        {matchingCluster?.name ? (matchingCluster.name.startsWith('คุ้ม') ? matchingCluster.name : `คุ้ม ${member.clusterId} - ${matchingCluster.name}`) : `คุ้ม ${member.clusterId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-[#131b2e]">{member.houseNo}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-[#006631]">{member.meetingAttended} ครั้ง</td>
                    <td className="px-6 py-4 text-right pr-12 font-black text-[#0f766e]">
                      {member.points.toLocaleString()} คะแนน
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
