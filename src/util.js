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
  PR: '🇵🇷'
};

const countryCodeToFlag = countryCode => flags[countryCode];

export { casesReducer, reduceByKey, countryCodeToFlag };