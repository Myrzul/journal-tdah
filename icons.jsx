// Flat SVG icons — vocabulaire pictogrammes du guide (pas d'emojis).
// Tous: 24x24 viewbox, currentColor par défaut.

const Ic = ({ children, size = 24, color = 'currentColor', stroke = 2.2, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

const IcBattery = (p) => <Ic {...p}><rect x="3" y="8" width="14" height="9" rx="1.5"/><rect x="6" y="11" width="6" height="3"/><line x1="17" y1="11" x2="17" y2="14"/></Ic>;
const IcEye = (p) => <Ic {...p}><path d="M2 12 C5 6 9 4 12 4 C15 4 19 6 22 12 C19 18 15 20 12 20 C9 20 5 18 2 12 Z"/><circle cx="12" cy="12" r="3"/></Ic>;
const IcCheck = (p) => <Ic {...p}><polyline points="4,12 10,18 20,6"/></Ic>;
const IcMoon = (p) => <Ic {...p}><path d="M20 14 A8 8 0 1 1 10 4 A6 6 0 0 0 20 14 Z"/></Ic>;
const IcSun = (p) => <Ic {...p}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.5" y1="4.5" x2="6.5" y2="6.5"/><line x1="17.5" y1="4.5" x2="15.5" y2="6.5"/><line x1="4.5" y1="19.5" x2="6.5" y2="17.5"/><line x1="17.5" y1="19.5" x2="15.5" y2="17.5"/></Ic>;
const IcCalendar = (p) => <Ic {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="6"/><line x1="16" y1="3" x2="16" y2="6"/></Ic>;
const IcCompass = (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><polygon points="15,9 12,15 9,9 12,11" fill="currentColor"/></Ic>;
const IcCloud = (p) => <Ic {...p}><path d="M7 18 H17 A4 4 0 0 0 17 10 A5 5 0 0 0 7 11 A4 4 0 0 0 7 18 Z"/></Ic>;
const IcList = (p) => <Ic {...p}><line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.2" fill="currentColor"/><circle cx="4" cy="12" r="1.2" fill="currentColor"/><circle cx="4" cy="18" r="1.2" fill="currentColor"/></Ic>;
const IcHeart = (p) => <Ic {...p}><path d="M12 20 C8 17 3 13 3 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8.5 C21 13 16 17 12 20 Z"/></Ic>;
const IcTarget = (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></Ic>;
const IcBolt = (p) => <Ic {...p}><polygon points="13,2 4,14 11,14 10,22 20,10 13,10"/></Ic>;
const IcShield = (p) => <Ic {...p}><path d="M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z"/></Ic>;
const IcSparkle = (p) => <Ic {...p}><path d="M12 3 L13.5 9 L20 10.5 L13.5 12 L12 18 L10.5 12 L4 10.5 L10.5 9 Z"/></Ic>;
const IcWind = (p) => <Ic {...p}><path d="M3 8 H14 A3 3 0 1 0 11 5"/><path d="M3 14 H17 A3 3 0 1 1 14 17"/></Ic>;
const IcBrush = (p) => <Ic {...p}><path d="M14 4 L20 10 L11 19 H5 V13 Z"/><line x1="14" y1="4" x2="11" y2="19"/></Ic>;
const IcRun = (p) => <Ic {...p}><circle cx="14" cy="5" r="2"/><path d="M9 21 L11 14 L8 11 L11 8 L14 9 L17 13 L20 13"/><path d="M11 14 L13 17 L11 21"/></Ic>;
const IcBook = (p) => <Ic {...p}><path d="M4 5 V19 A1 1 0 0 1 5 20 H11 V6 A2 2 0 0 0 9 4 H5 A1 1 0 0 0 4 5 Z"/><path d="M20 5 V19 A1 1 0 0 1 19 20 H13 V6 A2 2 0 0 1 15 4 H19 A1 1 0 0 1 20 5 Z"/></Ic>;
const IcDrop = (p) => <Ic {...p}><path d="M12 3 C8 8 5 12 5 15 A7 7 0 0 0 19 15 C19 12 16 8 12 3 Z"/></Ic>;
const IcCoffee = (p) => <Ic {...p}><path d="M4 9 H16 V15 A4 4 0 0 1 12 19 H8 A4 4 0 0 1 4 15 Z"/><path d="M16 11 H18 A2 2 0 0 1 18 15 H16"/><line x1="7" y1="3" x2="7" y2="6"/><line x1="11" y1="3" x2="11" y2="6"/></Ic>;
const IcLeaf = (p) => <Ic {...p}><path d="M5 19 C5 11 11 5 19 5 C19 13 13 19 5 19 Z"/><line x1="5" y1="19" x2="13" y2="11"/></Ic>;
const IcTooth = (p) => <Ic {...p}><path d="M7 4 C5 4 4 5 4 8 C4 12 6 13 7 17 C7.5 19 8 21 9 21 C10 21 10 18 12 18 C14 18 14 21 15 21 C16 21 16.5 19 17 17 C18 13 20 12 20 8 C20 5 19 4 17 4 C15 4 14 5 12 5 C10 5 9 4 7 4 Z"/></Ic>;
const IcPill = (p) => <Ic {...p}><rect x="3" y="9" width="18" height="6" rx="3"/><line x1="12" y1="9" x2="12" y2="15"/></Ic>;
const IcEgg = (p) => <Ic {...p}><path d="M12 3 C8 3 5 9 5 14 A7 7 0 0 0 19 14 C19 9 16 3 12 3 Z"/></Ic>;
const IcHourglass = (p) => <Ic {...p}><path d="M6 3 H18 V6 L13 12 L18 18 V21 H6 V18 L11 12 L6 6 Z"/></Ic>;
const IcPause = (p) => <Ic {...p}><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></Ic>;
const IcPhone = (p) => <Ic {...p}><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></Ic>;
const IcSpeaker = (p) => <Ic {...p}><polygon points="4,9 8,9 13,5 13,19 8,15 4,15"/><path d="M16 8 A4 4 0 0 1 16 16"/></Ic>;
const IcBulb = (p) => <Ic {...p}><path d="M12 3 A6 6 0 0 0 8 14 V16 H16 V14 A6 6 0 0 0 12 3 Z"/><line x1="9" y1="19" x2="15" y2="19"/><line x1="10" y1="21" x2="14" y2="21"/></Ic>;
const IcTrophy = (p) => <Ic {...p}><path d="M7 3 H17 V8 A5 5 0 0 1 7 8 Z"/><path d="M7 5 H4 V7 A3 3 0 0 0 7 10"/><path d="M17 5 H20 V7 A3 3 0 0 1 17 10"/><path d="M9 14 H15 V17 H9 Z"/><line x1="7" y1="20" x2="17" y2="20"/></Ic>;
const IcFlower = (p) => <Ic {...p}><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="12" r="2.5"/></Ic>;
const IcHand = (p) => <Ic {...p}><path d="M8 21 V13 M8 13 V6 A1.5 1.5 0 0 1 11 6 V11 M11 11 V5 A1.5 1.5 0 0 1 14 5 V11 M14 11 V6 A1.5 1.5 0 0 1 17 6 V14 C17 18 14 21 11 21 H8 Z"/></Ic>;
const IcGem = (p) => <Ic {...p}><polygon points="12,3 19,9 12,21 5,9"/><line x1="5" y1="9" x2="19" y2="9"/><line x1="12" y1="3" x2="9" y2="9"/><line x1="12" y1="3" x2="15" y2="9"/></Ic>;
const IcSeedling = (p) => <Ic {...p}><path d="M12 21 V13"/><path d="M12 13 C12 9 8 8 5 9 C5 13 8 14 12 13 Z"/><path d="M12 13 C12 9 16 8 19 9 C19 13 16 14 12 13 Z"/></Ic>;
const IcGift = (p) => <Ic {...p}><rect x="4" y="9" width="16" height="11" rx="1.5"/><line x1="12" y1="9" x2="12" y2="20"/><path d="M8 9 C5 9 5 4 8 4 C10 4 12 7 12 9"/><path d="M16 9 C19 9 19 4 16 4 C14 4 12 7 12 9"/></Ic>;
const IcMedal = (p) => <Ic {...p}><circle cx="12" cy="14" r="6"/><path d="M8 8 L6 3 H10 L12 8"/><path d="M16 8 L18 3 H14 L12 8"/><circle cx="12" cy="14" r="2.5"/></Ic>;
const IcEar = (p) => <Ic {...p}><path d="M8 21 C5 18 5 14 6 11 C7 6 11 4 14 5 C18 6 19 11 16 14 C14 16 13 17 13 19 C13 21 11 21 9 21 Z"/></Ic>;
const IcEyeOpen = (p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M3 12 C5 7 8 5 12 5 C16 5 19 7 21 12"/><line x1="12" y1="3" x2="12" y2="5"/><line x1="6" y1="6" x2="7" y2="7"/><line x1="18" y1="6" x2="17" y2="7"/></Ic>;
const IcMix = (p) => <Ic {...p}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="9" y1="9" x2="15" y2="15"/></Ic>;
const IcHome = (p) => <Ic {...p}><path d="M3 11 L12 3 L21 11 V20 H14 V14 H10 V20 H3 Z"/></Ic>;
const IcUsers = (p) => <Ic {...p}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20 C3 16 5 14 9 14 C13 14 15 16 15 20"/><path d="M15 20 C15 17 17 15 20 15"/></Ic>;
const IcClock = (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 16,14"/></Ic>;
const IcChat = (p) => <Ic {...p}><path d="M5 4 H19 A1 1 0 0 1 20 5 V15 A1 1 0 0 1 19 16 H10 L5 20 V16 H4 A1 1 0 0 1 4 5 Z"/></Ic>;
const IcSparkleSmall = (p) => <Ic {...p}><path d="M12 5 L13 11 L19 12 L13 13 L12 19 L11 13 L5 12 L11 11 Z"/></Ic>;
const IcCart = (p) => <Ic {...p}><path d="M3 4 H6 L8 17 H19 L21 8 H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></Ic>;
const IcMail = (p) => <Ic {...p}><rect x="3" y="6" width="18" height="13" rx="1.5"/><polyline points="3,7 12,13 21,7"/></Ic>;
const IcMoonStar = (p) => <Ic {...p}><path d="M20 14 A8 8 0 1 1 10 4 A6 6 0 0 0 20 14 Z"/><path d="M19 5 L19.5 6.5 L21 7 L19.5 7.5 L19 9 L18.5 7.5 L17 7 L18.5 6.5 Z"/></Ic>;
const IcMore = (p) => <Ic {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ic>;
const IcWriting = (p) => <Ic {...p}><path d="M3 21 L7 17 L17 7 L20 10 L10 20 L6 21 L3 21 L3 21 Z"/><line x1="14" y1="10" x2="17" y2="13"/></Ic>;
const IcWaves = (p) => <Ic {...p}><path d="M3 9 C5 7 7 7 9 9 C11 11 13 11 15 9 C17 7 19 7 21 9"/><path d="M3 15 C5 13 7 13 9 15 C11 17 13 17 15 15 C17 13 19 13 21 15"/></Ic>;
const IcStarBig = (p) => <Ic {...p}><polygon points="12,3 14,9 21,10 16,15 17,22 12,18 7,22 8,15 3,10 10,9"/></Ic>;
const IcArrowDR = (p) => <Ic {...p}><line x1="6" y1="6" x2="18" y2="18"/><polyline points="11,18 18,18 18,11"/></Ic>;

window.Icons = {
  Battery: IcBattery, Eye: IcEye, EyeOpen: IcEyeOpen, Check: IcCheck, Moon: IcMoon, MoonStar: IcMoonStar, Sun: IcSun,
  Calendar: IcCalendar, Compass: IcCompass, Cloud: IcCloud, List: IcList, Heart: IcHeart, Target: IcTarget,
  Bolt: IcBolt, Shield: IcShield, Sparkle: IcSparkle, Wind: IcWind, Brush: IcBrush, Run: IcRun, Book: IcBook,
  Drop: IcDrop, Coffee: IcCoffee, Leaf: IcLeaf, Tooth: IcTooth, Pill: IcPill, Egg: IcEgg,
  Hourglass: IcHourglass, Pause: IcPause, Phone: IcPhone, Speaker: IcSpeaker, Bulb: IcBulb,
  Trophy: IcTrophy, Flower: IcFlower, Hand: IcHand, Gem: IcGem, Seedling: IcSeedling, Gift: IcGift,
  Medal: IcMedal, Ear: IcEar, Mix: IcMix, Home: IcHome, Users: IcUsers, Clock: IcClock, Chat: IcChat,
  Cart: IcCart, Mail: IcMail, More: IcMore, Writing: IcWriting, Waves: IcWaves, StarBig: IcStarBig,
  ArrowDR: IcArrowDR, SparkleSmall: IcSparkleSmall
};
