const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_SHORT_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export function getCurrentThaiYear(): number {
  return new Date().getFullYear() + 543;
}

export function getCurrentThaiMonthName(): string {
  return THAI_MONTHS[new Date().getMonth()];
}

export function getCurrentThaiShortMonthName(): string {
  return THAI_SHORT_MONTHS[new Date().getMonth()];
}

export function getThaiCurrentMonthYear(): string {
  const now = new Date();
  const month = THAI_MONTHS[now.getMonth()];
  const year = now.getFullYear() + 543;
  return `${month} ${year}`;
}

export function getThaiCurrentShortMonthYear(): string {
  const now = new Date();
  const month = THAI_SHORT_MONTHS[now.getMonth()];
  const yearShort = String(now.getFullYear() + 543).slice(-2);
  return `${month} ${yearShort}`;
}

export function getPastFourThaiMonths(): { name: string; isCurrent: boolean }[] {
  const months = [];
  const now = new Date();
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = THAI_MONTHS[d.getMonth()];
    const yBE = d.getFullYear() + 543;
    months.push({
      name: `${mName} ${yBE}`,
      isCurrent: i === 0
    });
  }
  return months;
}
