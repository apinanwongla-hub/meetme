import { Member, Cluster, Meeting, VillageActivity } from './types';

export const INITIAL_CLUSTERS: Cluster[] = [
  { id: 1, name: 'คุ้ม1', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-primary' },
  { id: 2, name: 'คุ้ม2', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-tertiary' },
  { id: 3, name: 'คุ้ม3', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-primary' },
  { id: 4, name: 'คุ้ม4', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-secondary' },
  { id: 5, name: 'คุ้ม5', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-teal-500' },
  { id: 6, name: 'คุ้ม6', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-rose-500' },
  { id: 7, name: 'คุ้ม7', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-blue-600' },
  { id: 8, name: 'คุ้ม8', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-lime-500' },
  { id: 9, name: 'คุ้ม9', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-orange-600' },
  { id: 10, name: 'คุ้ม10', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-indigo-600' },
  { id: 11, name: 'คุ้ม11', leaderName: 'ยังไม่ได้ระบุหัวหน้า', memberCount: 0, attendancePercentage: 0, avatarColor: 'bg-emerald-500' }
];

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_MEETINGS: Meeting[] = [];

export const INITIAL_ACTIVITIES: VillageActivity[] = [];
