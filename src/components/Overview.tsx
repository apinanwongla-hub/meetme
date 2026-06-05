import React, { useState } from 'react';
import { Member, Cluster, Meeting, VillageActivity } from '../types';

interface OverviewProps {
  clusters: Cluster[];
  members: Member[];
  meetings: Meeting[];
  activities: VillageActivity[];
  onNavigateToTab: (tabId: string) => void;
  onAddDataClick: () => void;
}

export default function Overview({
  clusters,
  members,
  meetings,
  activities,
  onNavigateToTab,
  onAddDataClick
}: OverviewProps) {
  // Sort members by points descending and pick top 5
  const topFiveMembers = [...members]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const [houseSearchQuery, setHouseSearchQuery] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('ALL');

  interface HouseGroup {
    houseNo: string;
    clusterId: number;
    residents: Member[];
  }

  // Group members into houses based on houseNo and clusterId
  const housesMap: Record<string, HouseGroup> = {};
  members.forEach(m => {
    const key = `${m.houseNo}-${m.clusterId}`;
    if (!housesMap[key]) {
      housesMap[key] = {
        houseNo: m.houseNo,
        clusterId: m.clusterId,
        residents: []
      };
    }
    housesMap[key].residents.push(m);
  });

  const allHouses = Object.values(housesMap);

  const filteredHouses = allHouses.filter(h => {
    const matchesSearch = h.houseNo.toLowerCase().includes(houseSearchQuery.toLowerCase()) || 
      h.residents.some(r => r.name.toLowerCase().includes(houseSearchQuery.toLowerCase()));
    
    const matchesCluster = selectedClusterFilter === 'ALL' || String(h.clusterId) === selectedClusterFilter;

    return matchesSearch && matchesCluster;
  });

  // Active upcoming meetings & activities
  const upcomingMeetings = meetings.filter(m => m.status !== 'เสร็จสิ้น');
  const upcomingActivities = activities.filter(a => a.status === 'กำลังรับสมัคร');

  // Total points
  const totalPoints = members.reduce((sum, val) => sum + val.points, 0);
  const targetPoints = 60000;
  const targetPercent = Math.min(100, Math.round((totalPoints / targetPoints) * 100));

  // Helper color function to match the progress bar shades in our spec
  const getClusterBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-[#0f766e] shadow-[#0f766e]/20'; // Primary Teal
    if (percentage >= 70) return 'bg-[#00e475] shadow-[#00e475]/20'; // Tertiary Green
    if (percentage >= 55) return 'bg-[#cd4800] shadow-[#cd4800]/20'; // Orange/Amber
    return 'bg-[#ba1a1a] shadow-[#ba1a1a]/20'; // Error Red
  };

  const getClusterTextColor = (percentage: number) => {
    if (percentage >= 80) return 'text-[#0f766e]';
    if (percentage >= 70) return 'text-[#004b22]';
    if (percentage >= 55) return 'text-[#a33800]';
    return 'text-[#ba1a1a]';
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI widgets */}
      <div className="bg-gradient-to-r from-[#0f766e] to-[#0ea5e9] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-[#0f766e]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <span className="bg-[#00e475]/20 text-[#62ff96] text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-[#62ff96]/30">
              ยินดีต้อนรับสู่ระบบบริหารชุมชน
            </span>
            <h2 className="text-3xl font-black font-headline tracking-tight">ชุมชนบ้านฉลีก หมู่บ้านฉลีก หมู่ที่ 5 🌟</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl font-medium">
              ร่วมขับเคลื่อนความโปร่งใสและสร้างสรรค์สิ่งดีๆ ให้แก่ชุมชน สะสมคะแนนจากการเข้าร่วมประชุมและกิจกรรมพัฒนา ทะลุเป้าหมายรับงบกลางพัฒนาส่วนรวม!
            </p>
          </div>
          <div className="md:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">เป้าหมายคะแนนปีนี้</p>
                <p className="text-2xl font-black">{totalPoints.toLocaleString()} / {targetPoints.toLocaleString()} แต้ม</p>
              </div>
              <span className="text-3xl font-black text-amber-300">{targetPercent}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-amber-300 to-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,251,235,0.7)]"
                style={{ width: `${targetPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Column Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Clusters Progress Bar */}
        <div className="lg:col-span-7">
          <section className="bg-white p-8 rounded-[2rem] border border-[#cac3da]/50 shadow-xl shadow-slate-200/40 h-full">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0f766e]/10 text-[#0f766e] rounded-2xl">
                  <span className="material-symbols-outlined text-2xl font-bold">hub</span>
                </div>
                <div>
                  <h3 className="text-lg font-black font-headline text-[#131b2e]">การเข้าร่วมตามคุ้ม</h3>
                  <p className="text-xs font-semibold text-[#7a7489]">อัตราการเช็คชื่อเข้าประชุมล่าสุดจำแนกรายคุ้ม</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateToTab('clusters')}
                className="px-3 py-1 bg-gradient-to-r from-[#0f766e] to-[#0ea5e9] text-white text-[11px] font-black rounded-lg uppercase tracking-widest hover:brightness-110 shadow-md shadow-[#0f766e]/20"
              >
                ดูทั้งหมด
              </button>
            </div>

            <div className="space-y-5">
              {clusters.map((cluster) => {
                const colorClass = getClusterBarColor(cluster.attendancePercentage);
                const textCol = getClusterTextColor(cluster.attendancePercentage);
                return (
                  <div key={cluster.id} className="group cursor-pointer" onClick={() => onNavigateToTab('clusters')}>
                    <div className="flex justify-between text-xs font-bold mb-1.5 transition-colors group-hover:text-[#0f766e]">
                      <span className="text-[#494457]">{cluster.name.startsWith('คุ้ม') ? cluster.name : `คุ้ม ${cluster.id} - ${cluster.name}`}</span>
                      <span className={`font-black ${textCol}`}>{cluster.attendancePercentage}%</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] h-3 rounded-full overflow-hidden border border-[#cac3da]/20 group-hover:border-[#0f766e]/30 transition-all">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
                        style={{ width: `${cluster.attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Activities & Top score lists */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upcoming Activities */}
          <section className="bg-white p-6 rounded-[2rem] border border-[#cac3da]/50 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#cd4800]/10 text-[#cd4800] rounded-2xl shadow-sm">
                  <span className="material-symbols-outlined text-2xl font-bold">event</span>
                </div>
                <h3 className="text-base font-black font-headline text-[#131b2e]">กิจกรรมกำลังจะมาถึง</h3>
              </div>
              <span className="text-[10px] bg-teal-55 px-2.5 py-1 rounded-full text-[#0f766e] bg-teal-50 font-black">มิ.ย. 68</span>
            </div>

            <div className="space-y-4">
              {/* Combine upcoming meetings and activities */}
              {upcomingMeetings.map((meet) => (
                <div 
                  key={meet.id}
                  onClick={() => onNavigateToTab('meetings')}
                  className="group flex items-center gap-4 p-4 bg-teal-500/5 rounded-2xl border border-teal-500/15 hover:border-[#0f766e] transition-all cursor-pointer"
                >
                  <div className="text-center w-12 border-r border-[#0f766e]/30 pr-3 shrink-0">
                    <p className="text-xl font-black font-headline text-[#0f766e]">15</p>
                    <p className="text-[9px] font-black text-[#0f766e] uppercase tracking-wider">มิ.ย.</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-[#131b2e] truncate group-hover:text-[#0f766e] transition-colors">
                      {meet.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#7a7489] truncate">09:00 น. - {meet.location}</p>
                  </div>
                  <span className="shrink-0 bg-[#0f766e] text-white text-[9px] font-black px-2 py-1 rounded shadow-sm">
                    +{meet.pointsReward} แต้ม
                  </span>
                </div>
              ))}

              {upcomingActivities.slice(0, 2).map((act, idx) => {
                const colors = idx === 0 
                  ? { bg: 'bg-[#00e475]/5', border: 'border-[#00e475]/20', hover: 'hover:border-[#00e475]', text: 'text-[#004b22]', count: '22' }
                  : { bg: 'bg-[#cd4800]/5', border: 'border-[#cd4800]/20', hover: 'hover:border-[#cd4800]', text: 'text-[#cd4800]', count: '30' };
                return (
                  <div 
                    key={act.id}
                    onClick={() => onNavigateToTab('activities')}
                    className={`group flex items-center gap-4 p-4 ${colors.bg} rounded-2xl border ${colors.border} ${colors.hover} transition-all cursor-pointer`}
                  >
                    <div className={`text-center w-12 border-r ${idx === 0 ? 'border-[#00e475]' : 'border-[#cd4800]'}/30 pr-3 shrink-0`}>
                      <p className={`text-xl font-black font-headline ${colors.text}`}>{colors.count}</p>
                      <p className={`text-[9px] font-black ${colors.text} uppercase tracking-wider`}>มิ.ย.</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-[#131b2e] truncate transition-colors">
                        {act.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#7a7489] truncate">{act.timeStr} - {act.location}</p>
                    </div>
                    <span className={`shrink-0 ${idx === 0 ? 'bg-[#006631]' : 'bg-[#cd4800]'} text-white text-[9px] font-black px-2 py-1 rounded shadow-sm`}>
                      +{act.pointsReward} แต้ม
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top 5 Leaderboard */}
          <section className="bg-white p-6 rounded-[2rem] border border-[#cac3da]/50 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#0f766e] text-white rounded-2xl shadow-md">
                <span className="material-symbols-outlined text-2xl font-bold">military_tech</span>
              </div>
              <div>
                <h3 className="text-base font-black font-headline text-[#131b2e]">Top 5 คะแนนสะสม</h3>
                <p className="text-[11px] font-semibold text-[#7a7489]">ลูกบ้านดาวเด่นที่ทำกิจกรรมเพื่อส่วนรวมสูงสุด</p>
              </div>
            </div>

            <div className="space-y-1">
              {topFiveMembers.map((member, index) => {
                const clusterName = clusters.find(c => c.id === member.clusterId)?.name || `คุ้ม ${member.clusterId}`;
                const rankLabels = [
                  'bg-gradient-to-r from-[#0f766e] to-[#0ea5e9] text-white shadow-lg shadow-[#0f766e]/20',
                  'bg-teal-50 text-[#0f766e] font-extrabold',
                  'bg-teal-50 text-[#0f766e] font-extrabold',
                  'bg-slate-100 text-[#494457]',
                  'bg-slate-100 text-[#494457]'
                ];
                return (
                  <div 
                    key={member.id}
                    onClick={() => onNavigateToTab('points')}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-teal-50/40 transition-all cursor-pointer group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${rankLabels[index]}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-[#131b2e] truncate group-hover:text-[#0f766e] transition-colors">{member.name}</h4>
                      <p className="text-[10px] font-bold text-[#7a7489]">{clusterName.startsWith('คุ้ม') ? clusterName : `คุ้ม ${member.clusterId} - ${clusterName}`}</p>
                    </div>
                    <span className="text-right shrink-0">
                      <span className="text-[#0f766e] font-black text-sm">{member.points.toLocaleString()}</span>
                      <span className="text-[10px] text-[#7a7489] font-bold ml-1">แต้ม</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

      </div>

      {/* Row 3: House Number Search & Lookup */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#cac3da]/50 shadow-xl shadow-slate-200/40">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#cac3da]/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0f766e]/10 text-[#0f766e] rounded-2xl">
                <span className="material-symbols-outlined text-2xl font-bold">home_pin</span>
              </div>
              <div>
                <h3 className="text-lg font-black font-headline text-[#131b2e]">ค้นหาทำเนียบบ้านเลขที่ทุกคุ้ม (Universal House Number Directory)</h3>
                <p className="text-xs font-semibold text-[#7a7489]">ระบบข้อมูลสืบค้นบ้านเลขที่ ค้นหาคุ้ม สมาชิกที่พักอาศัย และคะแนนสะสมรายครัวเรือนของทุกคุ้ม</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#7a7489]">
              <span className="bg-teal-50 text-[#0f766e] px-3.5 py-1.5 rounded-xl font-extrabold">
                พบ {filteredHouses.length} ครัวเรือนในระบบ
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-[#7a7489]">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input
                type="text"
                value={houseSearchQuery}
                onChange={(e) => setHouseSearchQuery(e.target.value)}
                placeholder="ค้นหาตามบ้านเลขที่ (เช่น 45/1) หรือค้นตามชื่อลูกบ้าน..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#cac3da] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent transition-all"
              />
            </div>

            {/* Select Kum filter */}
            <div className="md:col-span-4">
              <select
                value={selectedClusterFilter}
                onChange={(e) => setSelectedClusterFilter(e.target.value)}
                className="w-full rounded-xl border border-[#cac3da] bg-white text-xs font-bold focus:ring-[#0f766e] focus:border-[#0f766e] h-[38px] cursor-pointer"
              >
                <option value="ALL">เลือกคุ้มสมาชิกพิกัด: ทุกคุ้ม (All)</option>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.startsWith('คุ้ม') ? c.name : `คุ้ม ${c.id} - ${c.name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear button */}
            <div className="md:col-span-2">
              <button
                onClick={() => {
                  setHouseSearchQuery('');
                  setSelectedClusterFilter('ALL');
                }}
                className="w-full bg-[#cd4800]/10 text-[#cd4800] border border-[#cd4800]/20 h-[38px] rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-[#cd4800] hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-sm font-black">restart_alt</span>
                รีเซ็ตข้อมูล
              </button>
            </div>
          </div>

          {/* Quick Suggestions Tags */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="text-[#7a7489] font-black mr-1">สืบค้นด่วน:</span>
            {['12', '45/1', '102/3', '33/5', '11/4'].map((suggestTerm) => (
              <button
                key={suggestTerm}
                type="button"
                onClick={() => setHouseSearchQuery(suggestTerm)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                  houseSearchQuery === suggestTerm
                    ? 'bg-[#0f766e] text-white border-transparent shadow-sm'
                    : 'bg-white text-[#494457] border-[#cac3da]/50 hover:bg-teal-50 hover:text-[#0f766e]'
                }`}
              >
                บ้านเลขที่ {suggestTerm}
              </button>
            ))}
          </div>

          {/* Results Area */}
          {filteredHouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
              {filteredHouses.map((house) => {
                const clusterInfo = clusters.find(c => c.id === house.clusterId);
                // Custom coloring
                const getKumColor = (id: number) => {
                  const colors: Record<number, { bg: string, text: string, border: string }> = {
                    1: { bg: 'bg-teal-500/10', text: 'text-teal-700', border: 'border-teal-500/20' },
                    2: { bg: 'bg-[#00e475]/10', text: 'text-[#004b22]', border: 'border-[#00e475]/20' },
                    3: { bg: 'bg-[#0ea5e9]/10', text: 'text-[#0ea5e9]', border: 'border-[#0ea5e9]/20' },
                    4: { bg: 'bg-orange-500/10', text: 'text-orange-700', border: 'border-orange-500/20' },
                    5: { bg: 'bg-teal-500/10', text: 'text-teal-700', border: 'border-teal-500/20' },
                    6: { bg: 'bg-rose-500/10', text: 'text-rose-700', border: 'border-rose-500/20' },
                    7: { bg: 'bg-blue-600/10', text: 'text-blue-700', border: 'border-blue-600/20' },
                    8: { bg: 'bg-lime-500/10', text: 'text-lime-700', border: 'border-lime-500/20' },
                    9: { bg: 'bg-orange-600/10', text: 'text-orange-700', border: 'border-orange-600/20' },
                    10: { bg: 'bg-indigo-600/10', text: 'text-indigo-700', border: 'border-indigo-600/20' },
                    11: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500/20' }
                  };
                  return colors[id] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
                };
                const colors = getKumColor(house.clusterId);

                return (
                  <div
                    key={`${house.houseNo}-${house.clusterId}`}
                    className="p-5 bg-slate-50 rounded-3xl border border-[#cac3da]/40 hover:border-[#0f766e]/30 hover:bg-[#0f766e]/5 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Top House Tag */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 bg-teal-100/50 text-[#0f766e] rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">home</span>
                          </div>
                          <span className="text-xs font-black text-[#131b2e]">บ้านเลขที่ {house.houseNo}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {clusterInfo?.name ? (clusterInfo.name.startsWith('คุ้ม') ? clusterInfo.name : `คุ้ม ${house.clusterId} • ${clusterInfo.name}`) : 'ทั่วไป'}
                        </span>
                      </div>

                      {/* Residents List */}
                      <div className="space-y-2 mt-4">
                        <p className="text-[10px] font-extrabold uppercase text-[#7a7489] tracking-wider">สมาชิกที่พำนัก ({house.residents.length}):</p>
                        {house.residents.map(r => (
                          <div key={r.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#cac3da]/20 shadow-xs">
                            <div className="min-w-0 pr-1">
                              <p className="text-xs font-black text-[#131b2e] truncate">{r.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5 mt-1">
                                <span className="text-[8px] font-black text-[#0f766e] bg-teal-50 px-1.5 py-0.5 rounded">
                                  {r.role}
                                </span>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                                  r.status === 'ปกติ' ? 'bg-[#1ed860]/10 text-[#006631]' : 'bg-[#cd4800]/10 text-[#cd4800]'
                                }`}>
                                  {r.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-[#0f766e]">{r.points.toLocaleString()}</span>
                              <span className="text-[8px] font-bold text-[#7a7489] block">แต้ม</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#cac3da]/10 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#7a7489]">
                        อัตราเช็คชื่อ{clusterInfo?.name || 'คุ้ม'} {clusterInfo?.attendancePercentage || 0}%
                      </span>
                      <button
                        onClick={() => onNavigateToTab('clusters')}
                        className="text-[10px] font-black text-[#0f766e] hover:underline flex items-center gap-0.5"
                      >
                        เข้าคุ้มสมาชิก <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-[#cac3da]/40">
              <span className="material-symbols-outlined text-4xl text-[#7a7489]/60 animate-bounce">roofing</span>
              <p className="text-xs font-black text-[#7a7489] mt-2">ไม่พบทะเบียนบ้านเลขที่ตามคำค้นหาที่ป้อน</p>
              <p className="text-[11px] text-[#7a7489]/80 mt-1">โปรดพิมพ์คำค้นหาอื่น หรือทำการรีเซ็ตข้อมูลตัวกรองด้านบน</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
