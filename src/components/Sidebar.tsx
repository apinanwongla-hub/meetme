import React from 'react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  openNewAnnouncement: () => void;
}

export default function Sidebar({ currentTab, onTabChange, openNewAnnouncement }: SidebarProps) {
  const menuGroups = [
    {
      title: 'หลัก',
      items: [
        { id: 'overview', title: 'ภาพรวม', icon: 'dashboard' }
      ]
    },
    {
      title: 'ข้อมูล',
      items: [
        { id: 'members', title: 'สมาชิก', icon: 'group' },
        { id: 'clusters', title: '11 คุ้ม', icon: 'hub' }
      ]
    },
    {
      title: 'กิจกรรม',
      items: [
        { id: 'meetings', title: 'ประชุมประจำเดือน', icon: 'event_note' },
        { id: 'checkin', title: 'เช็คชื่อ', icon: 'event_available' },
        { id: 'activities', title: 'กิจกรรมหมู่บ้าน', icon: 'local_activity' }
      ]
    },
    {
      title: 'วิเคราะห์',
      items: [
        { id: 'reports', title: 'รายงาน', icon: 'assessment' },
        { id: 'points', title: 'คะแนนสะสม', icon: 'stars' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#cac3da]/50 flex flex-col h-screen shrink-0" data-purpose="sidebar">
      {/* Brand Section */}
      <div className="p-6 flex items-center gap-3 border-b border-[#cac3da]/30">
        <div className="w-10 h-10 bg-[#0f766e] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0f766e]/20">
          <span className="material-symbols-outlined text-2xl font-bold">potted_plant</span>
        </div>
        <div>
          <h1 className="text-xs font-black tracking-tight text-[#131b2e] font-headline uppercase leading-tight">บ้านฉลีก หมู่ที่ 5</h1>
          <p className="text-[10px] font-bold text-[#7a7489] uppercase tracking-wider">ระบบบริหารชุมชน</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-4 pt-4">
        <button
          onClick={openNewAnnouncement}
          className="w-full py-3 px-4 bg-[#0f766e] text-white rounded-xl font-headline font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0d9488] transition-all shadow-md shadow-[#0f766e]/25 hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          ประกาศใหม่
        </button>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="text-[10px] font-black text-[#7a7489] uppercase tracking-widest mb-1.5 px-2">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all text-left font-semibold ${
                        isActive
                          ? 'bg-[#0f766e] text-white shadow-md shadow-[#0f766e]/20 font-bold'
                          : 'text-[#494457] hover:bg-[#e2e8f0]/60 hover:text-[#0f766e]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          isActive ? 'text-white' : 'text-[#7a7489]'
                        }`}
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
                      >
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info Card */}
      <div className="p-4 border-t border-[#cac3da]/40 bg-[#faf8ff]">
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#cac3da]/30 shadow-sm">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDThcGeolmQuDdu9Ndq-5K72BHNSJvF2RLu9TrbZ9c91MbNggvzIOxYGixzshYyJv686POHnG-iPCtv_lLqo80PcJTpFg48Rt_Kv4C6YavcCYuuwDmsVh2i0fFSGF62m0mvRKgPfRUON9VTkon5IgUAUYCordiGXt-OeqGxK3uN8_Eyc9eKFmr2NQ_2HyEK1y2rl9yDKNiCrwybqtspnKaVXwxPexyKB6U6RUKvagw3kOGSIP9WEu5JkIXXhivgUsOC8TbXTZX-hifV"
            alt="โปรไฟล์ผู้ดูแล"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md bg-slate-100"
            onError={(e) => {
              // Fallback if image fails to link
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[#131b2e] truncate">ผู้ดูแลระบบ</p>
            <p className="text-[10px] font-bold text-[#7a7489] truncate uppercase">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
