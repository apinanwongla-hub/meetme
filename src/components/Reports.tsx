import React from 'react';
import { Cluster, Member, Meeting } from '../types';

interface ReportsProps {
  clusters: Cluster[];
  members: Member[];
  meetings: Meeting[];
}

export default function Reports({ clusters, members, meetings }: ReportsProps) {
  // Compute true average attendance rate from clusters list
  const totalPercent = clusters.reduce((sum, c) => sum + c.attendancePercentage, 0);
  const avgAttendance = Math.round(totalPercent / clusters.length) || 64;

  // Best Performing Cluster info
  const bestCluster = [...clusters].sort((a, b) => b.attendancePercentage - a.attendancePercentage)[0];

  // Members needing assistance (status equals absent/at risk)
  const riskMembersCount = members.filter((m) => m.status === 'ขาดบ่อย').length;

  // Warning for cluster 6 or clusters < 50%
  const lowPerformingClusters = clusters.filter((c) => c.attendancePercentage < 50);

  // SVG Bar Chart dimensions for clusters attendance
  const chartHeight = 160;
  const maxVal = 100;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-3xl font-extrabold text-[#131b2e] tracking-tight font-headline">รายงานวิเคราะห์ชุมชน</h2>
        <p className="text-sm font-semibold text-[#7a7489]">ข้อมูลสถิติ ดัชนีตัวชี้วัดความร่วมมือและการมีส่วนร่วมของคุ้มต่างๆ</p>
      </div>

      {/* KPI DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#cac3da]/50 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0f766e]/10 text-[#0f766e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl font-black">pie_chart</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#7a7489] tracking-wider block">เฉลี่ยการเข้าประชุม</span>
            <p className="text-2xl font-black text-[#131b2e]">{avgAttendance}%</p>
            <span className="text-[10px] text-[#006631] font-bold">จากเป้าหมาย 70%</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#cac3da]/50 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00e475]/10 text-[#004b22] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl font-black">verified</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#7a7489] tracking-wider block">คุ้มดีเด่นอันดับ 1</span>
            <p className="text-base font-black text-[#131b2e] truncate max-w-[120px]">
              {bestCluster?.name ? (bestCluster.name.startsWith('คุ้ม') ? bestCluster.name : `คุ้ม ${bestCluster.id} ${bestCluster.name}`) : 'ไม่มีข้อมูล'}
            </p>
            <span className="text-xs font-black text-[#006631]">ความร่วมมือ {bestCluster?.attendancePercentage}%</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#cac3da]/50 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#cd4800]/10 text-[#cd4800] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl font-black">star</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#7a7489] tracking-wider block">แต้มสมทบส่วนกลาง</span>
            <p className="text-2xl font-black text-[#0f766e]">
              {members.reduce((sum, b) => sum + b.points, 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-[#7a7489] font-semibold">คะแนนสะสมของคนในชุมชน</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#cac3da]/50 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#ba1a1a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl font-black">report_problem</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#7a7489] tracking-wider block">สมาชิกขาดประชุมสะสม</span>
            <p className="text-2xl font-black text-[#ba1a1a]">{riskMembersCount} ครัวเรือน</p>
            <span className="text-[10px] text-[#ba1a1a] font-bold">ต้องการการติดตามช่วยเหลือ</span>
          </div>
        </div>

      </div>

      {/* CHART & ALERTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG CHART ROW (col-span-8) */}
        <div className="lg:col-span-8">
          <section className="bg-white p-8 rounded-[2rem] border border-[#cac3da]/50 shadow-lg h-full">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black font-headline text-[#131b2e]">อัตราการร่วมประชุมแยกรายคุ้ม (%)</h3>
                <p className="text-xs text-[#7a7489] font-bold">กราฟวัดสัดส่วนการเข้าลงชื่อตามวารสารปี 2568</p>
              </div>
              <span className="text-xs font-black bg-teal-50 border px-3 py-1 text-[#0f766e] rounded-lg">
                เป้าชุมชน: 70%
              </span>
            </div>

            {/* Custom Responsive SVG Bar Chart */}
            <div className="w-full h-56 flex flex-col justify-between">
              <div className="w-full flex items-end gap-x-2.5 sm:gap-x-4 h-44 border-b border-[#cac3da]/50 pb-2">
                {clusters.map((cluster) => {
                  const barHeight = (cluster.attendancePercentage / maxVal) * chartHeight;
                  const isLow = cluster.attendancePercentage < 50;
                  const barColor = isLow ? 'bg-[#ba1a1a]' : cluster.attendancePercentage >= 80 ? 'bg-[#0f766e]' : 'bg-[#00e475]';

                  return (
                    <div key={cluster.id} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-[#131b2e] text-white text-[10px] font-extrabold px-2.5 py-1 rounded shadow-lg transition-transform pointer-events-none z-10 whitespace-nowrap">
                        {cluster.attendancePercentage}% ({cluster.name})
                      </div>

                      <div 
                        className={`w-full ${barColor} rounded-t-lg transition-all duration-1000 group-hover:brightness-95 flex items-end justify-center`}
                        style={{ height: `${barHeight}px` }}
                      >
                        <span className="text-[9px] font-extrabold text-white mb-1.5 hidden sm:inline">
                          {cluster.attendancePercentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart X Labels */}
              <div className="w-full flex justify-between pt-2">
                {clusters.map((cluster) => (
                  <span key={cluster.id} className="flex-1 text-center text-[10px] font-black text-[#7a7489]">
                    K{cluster.id}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ALERTS & WARNS ROW (col-span-4) */}
        <div className="lg:col-span-4">
          <section className="bg-white p-6 border border-[#cac3da]/50 rounded-[2rem] shadow-lg flex flex-col gap-5 h-full justify-between">
            <div>
              <h3 className="text-base font-black font-[#131b2e] font-headline mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cd4800]">notifications_active</span>
                สัญญาณเตือนเฝ้าระวัง
              </h3>

              <div className="space-y-4">
                {lowPerformingClusters.map((cluster) => (
                  <div key={cluster.id} className="bg-red-50 border border-red-200/50 p-4 rounded-2xl flex gap-3">
                    <span className="material-symbols-outlined text-[#ba1a1a] font-bold shrink-0">error</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[#93000a]">
                        {cluster.name.startsWith('คุ้ม') ? cluster.name : `คุ้ม ${cluster.id} - ${cluster.name}`} ต่ำเกินเกณฑ์
                      </h4>
                      <p className="text-[11px] font-semibold text-[#ba1a1a]/80 mt-1">
                        อัตราเข้าร่วมต่ำอยู่ที่ <span className="font-extrabold">{cluster.attendancePercentage}%</span> ต่อเนื่อง 3 เดือนล่าสุด จำเป็นต้องหามาตรการส่งเสริมความร่วมมือ
                      </p>
                    </div>
                  </div>
                ))}

                <div className="bg-orange-50 border border-orange-200/50 p-4 rounded-2xl flex gap-3">
                  <span className="material-symbols-outlined text-[#cd4800] font-bold shrink-0 font-headline">diversity_3</span>
                  <div>
                    <h4 className="text-xs font-black text-[#a33800]">ขาดบ่อยสะสม {riskMembersCount} ราย</h4>
                    <p className="text-[11px] font-semibold text-[#a33800]/85 mt-1">
                      เตรียมจัดประชุมย่อยระดับหัวหน้าคุ้ม เพื่อร่วมวิเคราะห์ปัญหาและดูแลรายบ้านเลขที่แบบตรงเป้า
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('แอดมินสามารถเปิดและสั่งปริ้นแผ่นใบรายงานความร่วมมือลงกระดาษขนาด A4 เพื่อเผยแพร่ชุมชน')}
              className="w-full py-3 border border-[#cac3da] hover:bg-[#0f766e] text-[#0f766e] hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm font-bold">print</span>
              พิมพ์รายงานเผยแพร่ (PDF/A4)
            </button>
          </section>
        </div>

      </div>

      {/* MONTHLY RECORD TREND TABLES */}
      <section className="bg-white border border-[#cac3da]/50 rounded-[2rem] overflow-hidden shadow-lg p-6">
        <h3 className="text-base font-black font-headline text-[#131b2e] mb-4">แนวโน้มการมีส่วนร่วมรายปี</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50 text-center">
            <span className="text-[10px] font-black text-[#7a7489] uppercase">มีนาคม 2568</span>
            <p className="text-xl font-black text-[#131b2e]">56%</p>
            <span className="text-[9px] font-bold text-[#ba1a1a]">ต่ำกว่าค่าเฉลี่ย</span>
          </div>
          <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50 text-center">
            <span className="text-[10px] font-black text-[#7a7489] uppercase">เมษายน 2568</span>
            <p className="text-xl font-black text-[#131b2e]">66%</p>
            <span className="text-[9px] font-bold text-[#006631]">สอดคล้องตามมาตรฐาน</span>
          </div>
          <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50 text-center">
            <span className="text-[10px] font-black text-[#7a7489] uppercase">พฤษภาคม 2568</span>
            <p className="text-xl font-black text-[#131b2e]">61%</p>
            <span className="text-[9px] font-bold text-amber-600">ทรงตัว</span>
          </div>
          <div className="border border-slate-100 p-4 rounded-2xl bg-teal-50 text-center">
            <span className="text-[10px] font-black text-[#0f766e] uppercase">มิถุนายน 2568 (ล่าสุด)</span>
            <p className="text-xl font-black text-[#0f766e]">64%</p>
            <span className="text-[9px] font-bold text-[#006631]">สูงขึ้น 3% • ดี</span>
          </div>
        </div>
      </section>
    </div>
  );
}
