/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Member {
  id: string; // "001", "002" etc
  name: string;
  role: 'หัวหน้าคุ้ม' | 'สมาชิก';
  clusterId: number; // 1 to 11
  houseNo: string;
  meetingAttended: number; // meeting attendance count
  meetingTotal: number; // total meetings tracked for them
  activityCount: number; // activity registered count
  points: number; // accumulated points
  status: 'ปกติ' | 'พักงาน' | 'ขาดบ่อย';
}

export interface Cluster {
  id: number;
  name: string;
  leaderName: string;
  memberCount: number;
  attendancePercentage: number;
  avatarColor: string;
}

export interface Meeting {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  location: string;
  pointsReward: number;
  presentCount: number;
  totalMembers: number;
  status: 'เสร็จสิ้น' | 'เปิดเช็คชื่อ' | 'ร่าง';
  type: 'monthly' | 'special';
}

export interface VillageActivity {
  id: string;
  title: string;
  category: 'สิ่งแวดล้อม' | 'กีฬา' | 'ความรู้' | 'กิจกรรมเสร็จสิ้น';
  dateStr: string;
  timeStr: string;
  location: string;
  pointsReward: number;
  joinedCount: number;
  status: 'กำลังรับสมัคร' | 'ดำเนินการอยู่' | 'เสร็จสิ้นแล้ว';
  iconType: 'eco' | 'sports' | 'school' | 'favorite';
}

export interface CheckInLog {
  memberId: string;
  checked: boolean;
  checkInTime: string;
}
