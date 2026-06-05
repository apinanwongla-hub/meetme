import { Member, Cluster, Meeting, VillageActivity } from './types';

export const INITIAL_CLUSTERS: Cluster[] = [
  { id: 1, name: 'คุ้ม1', leaderName: 'นายวิชัย สุขใจ', memberCount: 48, attendancePercentage: 82, avatarColor: 'bg-primary' },
  { id: 2, name: 'คุ้ม2', leaderName: 'นายประสิทธิ์ มั่นคง', memberCount: 41, attendancePercentage: 75, avatarColor: 'bg-tertiary' },
  { id: 3, name: 'คุ้ม3', leaderName: 'นางสมจิต พงษ์ดี', memberCount: 55, attendancePercentage: 91, avatarColor: 'bg-primary' },
  { id: 4, name: 'คุ้ม4', leaderName: 'นางสายใจ กล้าหาญ', memberCount: 38, attendancePercentage: 58, avatarColor: 'bg-secondary' },
  { id: 5, name: 'คุ้ม5', leaderName: 'นายปรีชา คมจริง', memberCount: 43, attendancePercentage: 70, avatarColor: 'bg-teal-500' },
  { id: 6, name: 'คุ้ม6', leaderName: 'นางกมลวรรณ นามงาม', memberCount: 36, attendancePercentage: 44, avatarColor: 'bg-rose-500' },
  { id: 7, name: 'คุ้ม7', leaderName: 'นายมนัส เกรียงไกร', memberCount: 44, attendancePercentage: 63, avatarColor: 'bg-blue-600' },
  { id: 8, name: 'คุ้ม8', leaderName: 'นางสาวมาลี ทองดี', memberCount: 50, attendancePercentage: 77, avatarColor: 'bg-lime-500' },
  { id: 9, name: 'คุ้ม9', leaderName: 'นายอำพล ป่าเขียด', memberCount: 39, attendancePercentage: 55, avatarColor: 'bg-orange-600' },
  { id: 10, name: 'คุ้ม10', leaderName: 'นางวิลาวัลย์ แก้วมณี', memberCount: 46, attendancePercentage: 68, avatarColor: 'bg-indigo-600' },
  { id: 11, name: 'คุ้ม11', leaderName: 'นางรัตนา ใจดี', memberCount: 46, attendancePercentage: 72, avatarColor: 'bg-emerald-500' }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: '001',
    name: 'นางสมจิต พงษ์ดี',
    role: 'หัวหน้าคุ้ม',
    clusterId: 3,
    houseNo: '45/1',
    meetingAttended: 12,
    meetingTotal: 12,
    activityCount: 18,
    points: 280,
    status: 'ปกติ'
  },
  {
    id: '002',
    name: 'นายวิชัย สุขใจ',
    role: 'สมาชิก',
    clusterId: 1,
    houseNo: '12',
    meetingAttended: 11,
    meetingTotal: 12,
    activityCount: 15,
    points: 265,
    status: 'ปกติ'
  },
  {
    id: '003',
    name: 'นางสาวมาลี ทองดี',
    role: 'สมาชิก',
    clusterId: 8,
    houseNo: '78/2',
    meetingAttended: 9,
    meetingTotal: 12,
    activityCount: 12,
    points: 250,
    status: 'ปกติ'
  },
  {
    id: '004',
    name: 'นายประสิทธิ์ มั่นคง',
    role: 'สมาชิก',
    clusterId: 2,
    houseNo: '33',
    meetingAttended: 6,
    meetingTotal: 12,
    activityCount: 10,
    points: 238,
    status: 'ขาดบ่อย'
  },
  {
    id: '005',
    name: 'นางรัตนา ใจดี',
    role: 'สมาชิก',
    clusterId: 11,
    houseNo: '102/3',
    meetingAttended: 10,
    meetingTotal: 12,
    activityCount: 14,
    points: 225,
    status: 'ปกติ'
  },
  {
    id: '006',
    name: 'นายเฉลิมศักดิ์ สุขถาวร',
    role: 'สมาชิก',
    clusterId: 3,
    houseNo: '11/4',
    meetingAttended: 11,
    meetingTotal: 12,
    activityCount: 9,
    points: 190,
    status: 'ปกติ'
  },
  {
    id: '007',
    name: 'นางกวินธิดา มิ่งกนก',
    role: 'สมาชิก',
    clusterId: 5,
    houseNo: '56',
    meetingAttended: 8,
    meetingTotal: 12,
    activityCount: 12,
    points: 182,
    status: 'ปกติ'
  },
  {
    id: '008',
    name: 'นายเจษฎา พรหมวิหาร',
    role: 'สมาชิก',
    clusterId: 6,
    houseNo: '9/2',
    meetingAttended: 4,
    meetingTotal: 12,
    activityCount: 3,
    points: 98,
    status: 'ขาดบ่อย'
  },
  {
    id: '009',
    name: 'นางสาวปนัดดา พรานไพร',
    role: 'สมาชิก',
    clusterId: 10,
    houseNo: '88/1',
    meetingAttended: 9,
    meetingTotal: 12,
    activityCount: 11,
    points: 204,
    status: 'ปกติ'
  },
  {
    id: '010',
    name: 'นายเกรียงเดช มีสุข',
    role: 'สมาชิก',
    clusterId: 4,
    houseNo: '124/2',
    meetingAttended: 7,
    meetingTotal: 12,
    activityCount: 8,
    points: 165,
    status: 'ปกติ'
  },
  {
    id: '011',
    name: 'นางวันทา พันธ์ทิพย์',
    role: 'สมาชิก',
    clusterId: 8,
    houseNo: '44',
    meetingAttended: 3,
    meetingTotal: 12,
    activityCount: 5,
    points: 110,
    status: 'ปกติ'
  },
  {
    id: '012',
    name: 'นายสมชาย ใจดีมาก',
    role: 'สมาชิก',
    clusterId: 1,
    houseNo: '12/4',
    meetingAttended: 12,
    meetingTotal: 12,
    activityCount: 22,
    points: 2450,
    status: 'ปกติ'
  },
  {
    id: '013',
    name: 'คุณรินดา ขยันงาน',
    role: 'สมาชิก',
    clusterId: 2,
    houseNo: '45/12',
    meetingAttended: 11,
    meetingTotal: 12,
    activityCount: 16,
    points: 2120,
    status: 'ปกติ'
  },
  {
    id: '014',
    name: 'ดร.วิชัย รักดี',
    role: 'สมาชิก',
    clusterId: 8,
    houseNo: '8/1',
    meetingAttended: 10,
    meetingTotal: 12,
    activityCount: 20,
    points: 1980,
    status: 'ปกติ'
  },
  {
    id: '015',
    name: 'คุณป้าสมบูรณ์ แข็งแรง',
    role: 'สมาชิก',
    clusterId: 1,
    houseNo: '33/5',
    meetingAttended: 5,
    meetingTotal: 12,
    activityCount: 2,
    points: 850,
    status: 'ปกติ'
  },
  {
    id: '016',
    name: 'นางประนอม สีงาม',
    role: 'สมาชิก',
    clusterId: 5,
    houseNo: '112',
    meetingAttended: 9,
    meetingTotal: 12,
    activityCount: 10,
    points: 175,
    status: 'ปกติ'
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-001',
    title: 'ประชุมประจำเดือนมิถุนายน 2568',
    dateStr: 'วันเสาร์ที่ 15 มิถุนายน 2568',
    timeStr: '09:00 - 12:00 น.',
    location: 'ศาลาประชาคม',
    pointsReward: 10,
    presentCount: 312,
    totalMembers: 486,
    status: 'เปิดเช็คชื่อ',
    type: 'monthly'
  },
  {
    id: 'meet-002',
    title: 'ประชุมประจำเดือนพฤษภาคม 2568',
    dateStr: 'วันจันทร์ที่ 18 พฤษภาคม 2568',
    timeStr: '09:00 - 12:00 น.',
    location: 'ศาลาประชาคม',
    pointsReward: 10,
    presentCount: 298,
    totalMembers: 486,
    status: 'เสร็จสิ้น',
    type: 'monthly'
  },
  {
    id: 'meet-003',
    title: 'ประชุมประจำเดือนเมษายน 2568',
    dateStr: 'วันจันทร์ที่ 20 เมษายน 2568',
    timeStr: '09:00 - 12:00 น.',
    location: 'ศาลาประชาคม',
    pointsReward: 10,
    presentCount: 321,
    totalMembers: 486,
    status: 'เสร็จสิ้น',
    type: 'monthly'
  },
  {
    id: 'meet-004',
    title: 'ประชุมประจำเดือนมีนาคม 2568',
    dateStr: 'วันเสาร์ที่ 15 มีนาคม 2568',
    timeStr: '09:00 - 12:00 น.',
    location: 'ศาลาประชาคม',
    pointsReward: 10,
    presentCount: 275,
    totalMembers: 486,
    status: 'เสร็จสิ้น',
    type: 'monthly'
  }
];

export const INITIAL_ACTIVITIES: VillageActivity[] = [
  {
    id: 'act-001',
    title: 'Big Cleaning Day - ทำความสะอาดหมู่บ้าน',
    category: 'สิ่งแวดล้อม',
    dateStr: '22 มิ.ย. 2568',
    timeStr: '07:00-11:00 น.',
    location: 'ทั่วหมู่บ้าน',
    pointsReward: 15,
    joinedCount: 89,
    status: 'กำลังรับสมัคร',
    iconType: 'eco'
  },
  {
    id: 'act-002',
    title: 'แข่งขันกีฬาสัมพันธ์ระหว่างคุ้ม',
    category: 'กีฬา',
    dateStr: '30 มิ.ย. 2568',
    timeStr: '13:00-17:00 น.',
    location: 'สนามหน้าวัด',
    pointsReward: 20,
    joinedCount: 156,
    status: 'กำลังรับสมัคร',
    iconType: 'sports'
  },
  {
    id: 'act-003',
    title: 'อบรมการจัดการขยะในชุมชน',
    category: 'ความรู้',
    dateStr: '8 ก.ค. 2568',
    timeStr: '09:00-12:00 น.',
    location: 'ศาลาประชาคม',
    pointsReward: 25,
    joinedCount: 34,
    status: 'กำลังรับสมัคร',
    iconType: 'school'
  },
  {
    id: 'act-004',
    title: 'วันผู้สูงอายุชุมชน',
    category: 'กิจกรรมเสร็จสิ้น',
    dateStr: '13 เม.ย. 2568',
    timeStr: '09:00-16:00 น.',
    location: 'ศาลาเอนกประสงค์',
    pointsReward: 15,
    joinedCount: 218,
    status: 'เสร็จสิ้นแล้ว',
    iconType: 'favorite'
  }
];
