import React, { useState, useEffect } from 'react';
import { Member, Cluster, Meeting, VillageActivity } from './types';
import {
  INITIAL_CLUSTERS,
  INITIAL_MEMBERS,
  INITIAL_MEETINGS,
  INITIAL_ACTIVITIES
} from './data';

// Component Imports
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Members from './components/Members';
import Clusters from './components/Clusters';
import Meetings from './components/Meetings';
import CheckIn from './components/CheckIn';
import Activities from './components/Activities';
import Reports from './components/Reports';
import Points from './components/Points';

export default function App() {
  // Navigation active state
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Core Applet Database States
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activities, setActivities] = useState<VillageActivity[]>([]);

  // Announcement Modal States (Secondary actions)
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState<string | null>(null);

  // Time & System Info
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    // Standard real-time tick in UTC/Thai Time (for metadata visualization)
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }) + ' • ' + now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync state with LocalStorage on init
  useEffect(() => {
    const storedClusters = localStorage.getItem('baan_suan_dee_clusters');
    const storedMembers = localStorage.getItem('baan_suan_dee_members');
    const storedMeetings = localStorage.getItem('baan_suan_dee_meetings');
    const storedActivities = localStorage.getItem('baan_suan_dee_activities');

    if (storedClusters) {
      const parsed = JSON.parse(storedClusters) as Cluster[];
      const hasOldNames = parsed.some(c => c.name !== `คุ้ม${c.id}`);
      if (hasOldNames) {
        const updated = parsed.map(c => {
          const match = INITIAL_CLUSTERS.find(ic => ic.id === c.id);
          return match ? { ...c, name: match.name } : c;
        });
        setClusters(updated);
        localStorage.setItem('baan_suan_dee_clusters', JSON.stringify(updated));
      } else {
        setClusters(parsed);
      }
    } else {
      setClusters(INITIAL_CLUSTERS);
      localStorage.setItem('baan_suan_dee_clusters', JSON.stringify(INITIAL_CLUSTERS));
    }

    if (storedMembers) setMembers(JSON.parse(storedMembers));
    else {
      setMembers(INITIAL_MEMBERS);
      localStorage.setItem('baan_suan_dee_members', JSON.stringify(INITIAL_MEMBERS));
    }

    if (storedMeetings) setMeetings(JSON.parse(storedMeetings));
    else {
      setMeetings(INITIAL_MEETINGS);
      localStorage.setItem('baan_suan_dee_meetings', JSON.stringify(INITIAL_MEETINGS));
    }

    if (storedActivities) setActivities(JSON.parse(storedActivities));
    else {
      setActivities(INITIAL_ACTIVITIES);
      localStorage.setItem('baan_suan_dee_activities', JSON.stringify(INITIAL_ACTIVITIES));
    }
  }, []);

  // Update lists helpers
  const saveMembersToCache = (updatedList: Member[]) => {
    setMembers(updatedList);
    localStorage.setItem('baan_suan_dee_members', JSON.stringify(updatedList));

    // Dynamic adjustment of cluster member volume
    const reSyncClusters = clusters.map((cluster) => {
      const count = updatedList.filter((m) => m.clusterId === cluster.id).length;
      return { ...cluster, memberCount: count };
    });
    setClusters(reSyncClusters);
    localStorage.setItem('baan_suan_dee_clusters', JSON.stringify(reSyncClusters));
  };

  // Action listeners
  const handleAddMember = (newMem: Member) => {
    const updated = [...members, newMem];
    saveMembersToCache(updated);
  };

  const handleUpdateMember = (updatedMem: Member) => {
    const updated = members.map((m) => (m.id === updatedMem.id ? updatedMem : m));
    saveMembersToCache(updated);
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    saveMembersToCache(updated);
  };

  const handleAddMeeting = (newMeet: Meeting) => {
    const updated = [newMeet, ...meetings];
    setMeetings(updated);
    localStorage.setItem('baan_suan_dee_meetings', JSON.stringify(updated));
  };

  const handleAddActivity = (newAct: VillageActivity) => {
    const updated = [newAct, ...activities];
    setActivities(updated);
    localStorage.setItem('baan_suan_dee_activities', JSON.stringify(updated));
  };

  // Core Check-In point generator & recalculations
  const handleSaveCheckIn = (meetingId: string, checkedMemberIds: string[]) => {
    const targetMeet = meetings.find((m) => m.id === meetingId);
    if (!targetMeet) return;

    const pointsToAward = targetMeet.pointsReward || 10;

    // 1. Process member achievements
    const updatedMembers = members.map((m) => {
      const attended = checkedMemberIds.includes(m.id);
      return {
        ...m,
        meetingTotal: m.meetingTotal + 1,
        meetingAttended: attended ? m.meetingAttended + 1 : m.meetingAttended,
        points: attended ? m.points + pointsToAward : m.points
      };
    });
    setMembers(updatedMembers);
    localStorage.setItem('baan_suan_dee_members', JSON.stringify(updatedMembers));

    // 2. Complete target meeting status
    const updatedMeetings = meetings.map((meet) => {
      if (meet.id === meetingId) {
        return {
          ...meet,
          presentCount: checkedMemberIds.length,
          status: 'เสร็จสิ้น' as const
        };
      }
      return meet;
    });
    setMeetings(updatedMeetings);
    localStorage.setItem('baan_suan_dee_meetings', JSON.stringify(updatedMeetings));

    // 3. Recalculate clusters attendance rates dynamically based on community logs
    const updatedClusters = clusters.map((cluster) => {
      const clusterMems = updatedMembers.filter((m) => m.clusterId === cluster.id);
      if (clusterMems.length === 0) return cluster;

      const totalDenom = clusterMems.reduce((sum, m) => sum + m.meetingTotal, 0);
      const totalNumer = clusterMems.reduce((sum, m) => sum + m.meetingAttended, 0);
      const newPercent = totalDenom > 0 ? Math.round((totalNumer / totalDenom) * 100) : cluster.attendancePercentage;

      return {
        ...cluster,
        memberCount: clusterMems.length,
        attendancePercentage: newPercent
      };
    });
    setClusters(updatedClusters);
    localStorage.setItem('baan_suan_dee_clusters', JSON.stringify(updatedClusters));

    // Success alert, then redirect
    setCurrentTab('overview');
  };

  // Activity points recorder
  const handleRecordActivityReward = (actId: string, memberIds: string[]) => {
    const act = activities.find((a) => a.id === actId);
    if (!act) return;

    const points = act.pointsReward || 15;

    // 1. Double state membership point tallies
    const updatedMembers = members.map((m) => {
      const matched = memberIds.includes(m.id);
      return matched
        ? { ...m, points: m.points + points, activityCount: m.activityCount + 1 }
        : m;
    });
    setMembers(updatedMembers);
    localStorage.setItem('baan_suan_dee_members', JSON.stringify(updatedMembers));

    // 2. Set activity to finished state
    const updatedActs = activities.map((a) => {
      if (a.id === actId) {
        return {
          ...a,
          joinedCount: memberIds.length,
          status: 'เสร็จสิ้นแล้ว' as const
        };
      }
      return a;
    });
    setActivities(updatedActs);
    localStorage.setItem('baan_suan_dee_activities', JSON.stringify(updatedActs));

    setCurrentTab('overview');
  };

  // Announcement triggers
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.trim()) return;

    setActiveAnnouncement(announcementMsg);
    setAnnouncementMsg('');
    setIsAnnounceModalOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] selection:bg-teal-500/10" id="main-frame-root">
      
      {/* Dynamic Navigation Column */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        openNewAnnouncement={() => setIsAnnounceModalOpen(true)}
      />

      {/* Main Core Container */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* TOP STATUS BAR CONTAINER */}
        <header className="h-16 bg-white border-b border-[#cac3da]/40 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-[#7a7489] uppercase tracking-wider">
              {currentTimeStr || 'ชุมชนบ้านฉลีก หมู่ที่ 5 • ระบบบริหารหมู่บ้าน'}
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Live system state notification badge indicator */}
            <div className="flex items-center gap-1.5 bg-[#62ff96]/15 border border-[#1ced7c]/30 px-3.5 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1ced7c] animate-pulse"></span>
              <span className="text-[10px] font-black uppercase text-[#004b22] tracking-wider select-none">
                ระบบพร้อมทำงาน • Cloud Sync
              </span>
            </div>

            <button
              onClick={() => alert('ยังไม่มีประกาศข่าวแจ้งเตือนใหม่ในกล่องรับจดหมาย')}
              className="w-10 h-10 rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-[#7a7489] hover:text-[#0f766e] relative"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#cd4800]"></span>
            </button>
          </div>
        </header>

        {/* Dynamic global warning alert banner (Thai announcements) */}
        {activeAnnouncement && (
          <div className="bg-teal-50 border-b border-teal-200/50 px-8 py-3 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0f766e] animate-bounce">campaign</span>
              <p className="text-xs font-bold text-[#131b2e]">
                <span className="font-extrabold text-[#0f766e] mr-1.5">[ประกาศสำคัญจากผู้นำหมู่บ้าน]:</span> 
                {activeAnnouncement}
              </p>
            </div>
            <button
              onClick={() => setActiveAnnouncement(null)}
              className="text-[#7a7489] hover:text-[#ba1a1a] flex"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* VIEW BODY SCROLL SPACE */}
        <section className="flex-1 overflow-y-auto p-8" id="tab-viewport-scrollable">
          {currentTab === 'overview' && (
            <Overview
              clusters={clusters}
              members={members}
              meetings={meetings}
              activities={activities}
              onNavigateToTab={setCurrentTab}
              onAddDataClick={() => setCurrentTab('members')}
            />
          )}

          {currentTab === 'members' && (
            <Members
              members={members}
              clusters={clusters}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {currentTab === 'clusters' && (
            <Clusters
              clusters={clusters}
              members={members}
            />
          )}

          {currentTab === 'meetings' && (
            <Meetings
              meetings={meetings}
              onAddMeeting={handleAddMeeting}
              onNavigateToCheckin={(meetId) => {
                setCurrentTab('checkin');
              }}
              totalMembersCount={members.length}
            />
          )}

          {currentTab === 'checkin' && (
            <CheckIn
              members={members}
              meetings={meetings}
              clusters={clusters}
              onSaveCheckIn={handleSaveCheckIn}
            />
          )}

          {currentTab === 'activities' && (
            <Activities
              activities={activities}
              members={members}
              clusters={clusters}
              onAddActivity={handleAddActivity}
              onRecordActivityReward={handleRecordActivityReward}
            />
          )}

          {currentTab === 'reports' && (
            <Reports
              clusters={clusters}
              members={members}
              meetings={meetings}
            />
          )}

          {currentTab === 'points' && (
            <Points
              members={members}
              clusters={clusters}
            />
          )}
        </section>
      </main>

      {/* MODAL WRITING NEW ANNOUNCEMENT */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#cac3da] shadow-2xl">
            <h3 className="text-xl font-black font-headline text-[#131b2e] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f766e]">campaign</span> เขียนข้อความประกาศหมู่บ้าน
            </h3>
            <p className="text-xs text-[#7a7489] font-bold mb-6">
              ข้อความนี้จะปรากฏที่ระบบแจ้งเตือนหลักส่วนบน สำหรับพนักงาน และลูกบ้านทุกคนที่เข้ามาใช้งานหน้าจอ
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#7a7489] uppercase mb-1.5">หัวข้อรายละเอียดประกาศ</label>
                <textarea
                  rows={4}
                  required
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  placeholder="เช่น เรียนลุกบ้านทุกคุ้ม โปรดเข้าร่วมกิจกรรมพับหญ้าแฝกเพื่อเป็นเกียรติแก่ชุมชน ในวันอาทิตย์นี้ เวลา 10:00 น. ณ ศาลารวมคุ้ม"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cac3da] text-xs font-medium focus:ring-2 focus:ring-[#0f766e] focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAnnounceModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#494457] text-sm font-bold transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#0d9488] text-white text-sm font-bold transition-all shadow-md shadow-[#0f766e]/20"
                >
                  โพสต์แจ้งข่าวสาร
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
