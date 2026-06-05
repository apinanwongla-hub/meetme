const THAI_MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTH_SHORT_NAMES = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const THAI_DAY_NAMES = [
  'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'
];

export function getBuddhistEraYear(date: Date = new Date()): number {
  return date.getFullYear() + 543;
}

export function getBuddhistEraYearShort(date: Date = new Date()): string {
  const beYear = getBuddhistEraYear(date);
  return String(beYear).slice(-2);
}

export function getThaiMonthName(date: Date = new Date()): string {
  return THAI_MONTH_NAMES[date.getMonth()];
}

export function getThaiMonthShort(date: Date = new Date()): string {
  return THAI_MONTH_SHORT_NAMES[date.getMonth()];
}

export function getCurrentThaiMonthYearString(date: Date = new Date()): string {
  return `${getThaiMonthName(date)} ${getBuddhistEraYear(date)}`;
}

export function getThaiDayName(date: Date = new Date()): string {
  return THAI_DAY_NAMES[date.getDay()];
}

/**
 * Formats a date to Thai layout: e.g. "วันศุกร์ที่ 5 มิถุนายน 2569"
 */
export function formatToThaiFullDate(date: Date = new Date()): string {
  const dayName = getThaiDayName(date);
  const mNum = date.getDate();
  const monthName = getThaiMonthName(date);
  const beYear = getBuddhistEraYear(date);
  return `${dayName}ที่ ${mNum} ${monthName} ${beYear}`;
}

/**
 * Formats a date to Thai layout: e.g. "5 มิ.ย. 2569"
 */
export function formatToThaiShortDate(date: Date = new Date()): string {
  const mNum = date.getDate();
  const monthShortName = getThaiMonthShort(date);
  const beYear = getBuddhistEraYear(date);
  return `${mNum} ${monthShortName} ${beYear}`;
}

/**
 * Parses a Thai date string to extract the day and short month.
 * Fallbacks to current day and month if not found.
 */
export function parseThaiDateString(dateStr: string): { day: string; monthShort: string } {
  const fallback = {
    day: String(new Date().getDate()),
    monthShort: getThaiMonthShort()
  };

  if (!dateStr) return fallback;

  // Extract first number found as day
  const matchDay = dateStr.match(/\d+/);
  const day = matchDay ? matchDay[0] : fallback.day;

  // Find month
  let monthShort = fallback.monthShort;
  for (let i = 0; i < 12; i++) {
    const fullName = THAI_MONTH_NAMES[i];
    const shortName = THAI_MONTH_SHORT_NAMES[i];
    if (dateStr.includes(fullName) || dateStr.includes(shortName)) {
      monthShort = shortName;
      break;
    }
  }

  return { day, monthShort };
}

/**
 * Returns the names of the last 4 months (including current month) with Buddhist Era year.
 * e.g., ["มีนาคม 2569", "เมษายน 2569", "พฤษภาคม 2569", "มิถุนายน 2569"]
 */
export function getLastFourMonthsThai(): string[] {
  const result: string[] = [];
  const currentDate = new Date();
  
  for (let i = 3; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const mName = getThaiMonthName(d);
    const beYear = getBuddhistEraYear(d);
    result.push(`${mName} ${beYear}`);
  }
  
  return result;
}


