const countries = {
  US: { flag: '🇺🇸', population: 328_200_000 },
  India: { flag: '🇮🇳', population: 1_366_000_000 },
  Brazil: { flag: '🇧🇷', population: 211_000_000 },
  France: { flag: '🇫🇷', population: 67_060_000 },
  Turkey: { flag: '🇹🇷', population: 82_000_000 },
  Russia: { flag: '🇷🇺', population: 144_400_000 },
  'United Kingdom': { flag: '🇬🇧', population: 66_650_000 },
  Italy: { flag: '🇮🇹', population: 60_360_000 },
  Spain: { flag: '🇪🇸', population: 46_940_000 },
  Germany: { flag: '🇩🇪', population: 83_020_000 },
  Argentina: { flag: '🇦🇷', population: 44_940_000 },
  Colombia: { flag: '🇨🇴', population: 50_340_000 },
  Poland: { flag: '🇵🇱', population: 37_970_000 },
  Iran: { flag: '🇮🇷', population: 82_910_000 },
  Mexico: { flag: '🇲🇽', population: 127_600_000 },
  Ukraine: { flag: '🇺🇦', population: 44_390_000 },
  Peru: { flag: '🇵🇪', population: 32_510_000 },
  Indonesia: { flag: '🇮🇩', population: 270_600_000 },
  Czechia: { flag: '🇨🇿', population: 10_650_000 },
  'South Africa': { flag: '🇿🇦', population: 58_560_000 },
  Netherlands: { flag: '🇳🇱', population: 17_280_000 },
  Canada: { flag: '🇨🇦', population: 37_590_000 },
  Chile: { flag: '🇨🇱', population: 18_950_000 },
  Iraq: { flag: '🇮🇶', population: 39_310_000 },
  Romania: { flag: '🇷🇴', population: 19_410_000 },
  Philippines: { flag: '🇵🇭', population: 108_100_000 },
  Belgium: { flag: '🇧🇪', population: 11_460_000 },
  Sweden: { flag: '🇸🇪', population: 10_230_000 },
  Israel: { flag: '🇮🇱', population: 9_053_000 },
  Portugal: { flag: '🇵🇹', population: 10_280_000 },
  Pakistan: { flag: '🇵🇰', population: 216_600_000 },
  Hungary: { flag: '🇭🇺', population: 9_773_000 },
  Bangladesh: { flag: '🇧🇩', population: 163_000_000 },
  Jordan: { flag: '🇯🇴', population: 10_100_000 },
  Serbia: { flag: '🇷🇸', population: 6_945_000 },
  Switzerland: { flag: '🇨🇭', population: 8_545_000 },
  Austria: { flag: '🇦🇹', population: 8_859_000 },
  Japan: { flag: '🇯🇵', population: 126_300_000 },
  Lebanon: { flag: '🇱🇧', population: 6_856_000 },
  'United Arab Emirates': { flag: '🇦🇪', population: 9_771_000 },
  Morocco: { flag: '🇲🇦', population: 36_470_000 },
  'Saudi Arabia': { flag: '🇸🇦', population: 34_270_000 },
  Malaysia: { flag: '🇲🇾', population: 31_950_000 },
  Bulgaria: { flag: '🇧🇬', population: 7_000_000 },
  Ecuador: { flag: '🇪🇨', population: 17_370_000 },
  Kazakhstan: { flag: '🇰🇿', population: 18_510_000 },
  Slovakia: { flag: '🇸🇰', population: 5_450_000 },
  Nepal: { flag: '🇳🇵', population: 28_610_000 },
  Panama: { flag: '🇵🇦', population: 4_246_000 },
  Belarus: { flag: '🇧🇾', population: 9_467_000 },
  Greece: { flag: '🇬🇷', population: 10_720_000 },
  Croatia: { flag: '🇭🇷', population: 4_076_000 }
};

const casesReducer = (acc, cur) => ({
  date: acc.date,
  dateString: acc.dateString,
  countryName: acc.countryName,
  newCases: acc.newCases + cur.newCases,
  deaths: acc.deaths + cur.deaths,
  population: acc.population
});

const reduceByKey = (arr, key, reducer) => arr.reduce((acc, cur) => {
  const prevValue = acc[cur[key]];
  acc[cur[key]] = prevValue ? reducer(prevValue, cur) : cur;
  return acc;
}, {});

const flags = {
  CN: '🇨🇳',
  IT: '🇮🇹',
  IR: '🇮🇷',
  ES: '🇪🇸',
  US: '🇺🇸',
  FR: '🇫🇷',
  KR: '🇰🇷',
  DE: '🇩🇪',
  CH: '🇨🇭',
  UK: '🇬🇧',
  NL: '🇳🇱',
  AT: '🇦🇹',
  BE: '🇧🇪',
  NO: '🇳🇴',
  SE: '🇸🇪',
  DK: '🇩🇰',
  JP: '🇯🇵',
  MY: '🇲🇾',
  JPG11668: '🚢',
  CA: '🇨🇦',
  PT: '🇵🇹',
  AU: '🇦🇺',
  CZ: '🇨🇿',
  QA: '🇶🇦',
  IL: '🇮🇱',
  BR: '🇧🇷',
  EL: '🇬🇷',
  FI: '🇫🇮',
  IE: '🇮🇪',
  SG: '🇸🇬',
  PK: '🇵🇰',
  PL: '🇵🇱',
  SI: '🇸🇮',
  RO: '🇷🇴',
  EE: '🇪🇪',
  BH: '🇧🇭',
  IS: '🇮🇸',
  CL: '🇨🇱',
  LU: '🇱🇺',
  PH: '🇵🇭',
  EG: '🇪🇬',
  TR: '🇹🇷',
  TH: '🇹🇭',
  ID: '🇮🇩',
  SA: '🇸🇦',
  EC: '🇪🇨',
  IN: '🇮🇳',
  IQ: '🇮🇶',
  RU: '🇷🇺',
  PE: '🇵🇪',
  KW: '🇰🇼',
  LB: '🇱🇧',
  MX: '🇲🇽',
  ZA: '🇿🇦',
  AM: '🇦🇲',
  AE: '🇦🇪',
  PA: '🇵🇦',
  SM: '🇸🇲',
  TW: '🇹🇼',
  SK: '🇸🇰',
  CO: '🇨🇴',
  AR: '🇦🇷',
  RS: '🇷🇸',
  BG: '🇧🇬',
  HR: '🇭🇷',
  UY: '🇺🇾',
  VN: '🇻🇳',
  DZ: '🇩🇿',
  HU: '🇭🇺',
  LV: '🇱🇻',
  CR: '🇨🇷',
  BN: '🇧🇳',
  AL: '🇦🇱',
  CY: '🇨🇾',
  MA: '🇲🇦',
  AD: '🇦🇩',
  JO: '🇯🇴',
  MT: '🇲🇹',
  BY: '🇧🇾',
  PS: '🇵🇸',
  MK: '🇲🇰',
  LK: '🇱🇰',
  OM: '🇴🇲',
  KZ: '🇰🇿',
  BA: '🇧🇦',
  MD: '🇲🇩',
  SN: '🇸🇳',
  AZ: '🇦🇿',
  GE: '🇬🇪',
  LT: '🇱🇹',
  VE: '🇻🇪',
  TN: '🇹🇳',
  NZ: '🇳🇿',
  BF: '🇧🇫',
  LI: '🇱🇮',
  KH: '🇰🇭',
  UZ: '🇺🇿',
  AF: '🇦🇫',
  DO: '🇩🇴',
  XK: '🇽🇰',
  UA: '🇺🇦',
  JM: '🇯🇲',
  CD: '🇨🇩',
  MV: '🇲🇻',
  BO: '🇧🇴',
  HN: '🇭🇳',
  CU: '🇨🇺',
  PY: '🇵🇾',
  RW: '🇷🇼',
  BD: '🇧🇩',
  CM: '🇨🇲',
  MC: '🇲🇨',
  TT: '🇹🇹',
  GT: '🇬🇹',
  ME: '🇲🇪',
  NG: '🇳🇬',
  GH: '🇬🇭',
  KE: '🇰🇪',
  CI: '🇨🇮',
  ET: '🇪🇹',
  SC: '🇸🇨',
  GY: '🇬🇾',
  MN: '🇲🇳',
  CG: '🇨🇬',
  GQ: '🇬🇶',
  PYF: '🇵🇫',
  GA: '🇬🇦',
  GU: '🇬🇺',
  KG: '🇰🇬',
  TZ: '🇹🇿',
  LR: '🇱🇷',
  NA: '🇳🇦',
  LC: '🇱🇨',
  SD: '🇸🇩',
  ZM: '🇿🇲',
  AG: '🇦🇬',
  BS: '🇧🇸',
  BB: '🇧🇧',
  BJ: '🇧🇯',
  BT: '🇧🇹',
  CF: '🇨🇫',
  DJ: '🇩🇯',
  SV: '🇸🇻',
  SZ: '🇸🇿',
  GM: '🇬🇲',
  GN: '🇬🇳',
  VA: '🇻🇦',
  MR: '🇲🇷',
  NP: '🇳🇵',
  NI: '🇳🇮',
  VC: '🇻🇨',
  SO: '🇸🇴',
  SR: '🇸🇷',
  TG: '🇹🇬',
  MM: '🇲🇲',
  FO: '🇫🇴',
  GI: '🇬🇮',
  AN: '🇧🇶',
  MU: '🇲🇺',
  JE: '🇯🇪',
  BM: '🇧🇲',
  GL: '🇬🇱',
  HT: '🇭🇹',
  KY: '🇰🇾',
  TD: '🇹🇩',
  FJ: '🇫🇯',
  GG: '🇬🇬',
  MG: '🇲🇬',
  CV: '🇨🇻',
  NC: '🇳🇨',
  IM: '🇮🇲',
  MS: '🇲🇸',
  NE: '🇳🇪',
  PG: '🇵🇬',
  ZW: '🇿🇼',
  AO: '🇦🇴',
  ER: '🇪🇷',
  TL: '🇹🇱',
  UG: '🇺🇬',
  DM: '🇩🇲',
  GD: '🇬🇩',
  MZ: '🇲🇿',
  SY: '🇸🇾',
  GR: '🇬🇷',
  VI: '🇻🇮',
  BZ: '🇧🇿',
  LA: '🇱🇦',
  LY: '🇱🇾',
  TC: '🇹🇨',
  AW: '🇦🇼',
  CW: '🇨🇼',
  ML: '🇲🇱',
  KN: '🇰🇳',
  SX: '🇸🇽',
  PF: '🇵🇫',
  AI: '🇦🇮',
  VG: '🇻🇬',
  GW: '🇬🇼',
  PR: '🇵🇷',
  MP: '🇲🇵',
  SS: '🇸🇸',
  FK: '🇫🇰',
  BW: '🇧🇼',
  BI: '🇧🇮',
  SL: '🇸🇱',
  BL: '🇧🇱',
  BLM: '🇧🇱',
  BQ: '🇧🇶',
  MW: '🇲🇼',
  ST: '🇸🇹',
  YE: '🇾🇪',
  SH: '🇸🇭',
  EH: '🇪🇭',
  KM: '🇰🇲',
  TJ: '🇹🇯',
  LS: '🇱🇸',
  SB: '🇸🇧',
  WF: '🇼🇫',
  MH: '🇲🇭',
  VU: '🇻🇺',
  FM: '🇫🇲'
};

const countryCodeToFlag = countryCode => flags[countryCode];

const nextDate = (date, n) => {
  const result = new Date(date);
  result.setDate(date.getDate() + (n || 1));
  return result;
}

const countryInfo = countryName => countries[countryName];

export { casesReducer, reduceByKey, countryCodeToFlag, nextDate, countryInfo };