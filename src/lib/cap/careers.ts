import { RIASEC_LABEL, RIASEC_ORDER } from "./interest-items";
import type { CapSession } from "./types";

export interface Occupation {
  title: string;
  holland: string;
  zone: 2 | 3 | 4 | 5;
  onet: string;
  cluster: string;
}

export const OCCUPATIONS: Occupation[] = [
  { title: "Carpenter", holland: "RCI", zone: 2, onet: "47-2031.00", cluster: "Architecture & Construction" },
  { title: "Electrician", holland: "RIC", zone: 3, onet: "47-2111.00", cluster: "Architecture & Construction" },
  { title: "Aircraft mechanic", holland: "RIC", zone: 3, onet: "49-3011.00", cluster: "Transportation" },
  { title: "Civil engineering technician", holland: "RIC", zone: 3, onet: "17-3022.00", cluster: "STEM" },
  { title: "Robotics technician", holland: "RIC", zone: 3, onet: "17-3024.01", cluster: "STEM" },
  { title: "Surveyor", holland: "RIE", zone: 4, onet: "17-1022.00", cluster: "Architecture & Construction" },
  { title: "Biological technician", holland: "IRC", zone: 4, onet: "19-4021.00", cluster: "STEM" },
  { title: "Software developer", holland: "ICR", zone: 4, onet: "15-1252.00", cluster: "Information Technology" },
  { title: "Chemist", holland: "IRC", zone: 4, onet: "19-2031.00", cluster: "STEM" },
  { title: "Data scientist", holland: "ICR", zone: 5, onet: "15-2051.00", cluster: "STEM" },
  { title: "Physician", holland: "ISR", zone: 5, onet: "29-1229.00", cluster: "Health Science" },
  { title: "Mechanical engineer", holland: "IRC", zone: 4, onet: "17-2141.00", cluster: "STEM" },
  { title: "Graphic designer", holland: "ARE", zone: 4, onet: "27-1024.00", cluster: "Arts" },
  { title: "Writer", holland: "AIE", zone: 4, onet: "27-3043.00", cluster: "Arts" },
  { title: "Film and video editor", holland: "AER", zone: 4, onet: "27-4032.00", cluster: "Arts" },
  { title: "Architect", holland: "AIR", zone: 5, onet: "17-1011.00", cluster: "Architecture & Construction" },
  { title: "Musician", holland: "AES", zone: 3, onet: "27-2042.00", cluster: "Arts" },
  { title: "Web / UX designer", holland: "AEI", zone: 4, onet: "15-1255.00", cluster: "Information Technology" },
  { title: "Secondary school teacher", holland: "SAE", zone: 4, onet: "25-2031.00", cluster: "Education" },
  { title: "Registered nurse", holland: "SIR", zone: 4, onet: "29-1141.00", cluster: "Health Science" },
  { title: "Mental health counselor", holland: "SAI", zone: 5, onet: "21-1014.00", cluster: "Human Services" },
  { title: "Physical therapist", holland: "SRI", zone: 5, onet: "29-1123.00", cluster: "Health Science" },
  { title: "Social worker", holland: "SEA", zone: 5, onet: "21-1021.00", cluster: "Human Services" },
  { title: "Athletic trainer", holland: "SRI", zone: 5, onet: "29-9091.00", cluster: "Health Science" },
  { title: "Sales manager", holland: "ECS", zone: 4, onet: "11-2022.00", cluster: "Business" },
  { title: "General / operations manager", holland: "ECS", zone: 3, onet: "11-1021.00", cluster: "Business" },
  { title: "Lawyer", holland: "EIA", zone: 5, onet: "23-1011.00", cluster: "Law" },
  { title: "Real estate broker", holland: "ECR", zone: 3, onet: "41-9021.00", cluster: "Business" },
  { title: "Marketing manager", holland: "EAC", zone: 4, onet: "11-2021.00", cluster: "Business" },
  { title: "Construction manager", holland: "ERC", zone: 4, onet: "11-9021.00", cluster: "Architecture & Construction" },
  { title: "Accountant / auditor", holland: "CEI", zone: 4, onet: "13-2011.00", cluster: "Business" },
  { title: "Logistician", holland: "CEI", zone: 4, onet: "13-1081.00", cluster: "Business" },
  { title: "Medical records specialist", holland: "CEI", zone: 3, onet: "29-2072.00", cluster: "Health Science" },
  { title: "Financial analyst", holland: "CIE", zone: 4, onet: "13-2051.00", cluster: "Business" },
  { title: "Database administrator", holland: "CI", zone: 4, onet: "15-1242.00", cluster: "Information Technology" },
  { title: "Court reporter", holland: "CES", zone: 3, onet: "27-3092.00", cluster: "Law" },
];

export function onetUrl(code: string) {
  return `https://www.mynextmove.org/profile/summary/${code}`;
}

export function zoneLabel(zone: number) {
  if (zone >= 5) return "Usually graduate training";
  if (zone === 4) return "Usually a bachelor's";
  if (zone === 3) return "Certificate or associate";
  return "On-the-job or high school";
}

function letterRank(holland: string, code: string) {
  let s = 0;
  if (holland[0] && holland[0] === code[0]) s += 4;
  if (holland[1] && code.includes(holland[1])) s += 2;
  if (holland[2] && code.includes(holland[2])) s += 1;
  return s;
}

export function preferredZones(session: CapSession | null): number[] {
  const icar = session?.results.icar?.icar;
  if (!icar || !icar.max) return [2, 3, 4, 5];
  const p = icar.total / icar.max;
  if (p >= 0.75) return [4, 5, 3];
  if (p >= 0.5) return [3, 4, 5, 2];
  return [2, 3, 4];
}

export function rankOccupations(session: CapSession | null): Occupation[] {
  const holland = session?.results.interest?.interest?.holland ?? "RIA";
  const zones = preferredZones(session);
  const hex = session?.results.hexaco?.hexaco?.factors;
  return [...OCCUPATIONS]
    .map((occ) => {
      let score = letterRank(holland, occ.holland) * 10;
      const zi = zones.indexOf(occ.zone);
      score += zi === -1 ? 0 : (4 - zi) * 2;
      if (hex) {
        if ((hex.Extraversion ?? 3) >= 4 && /[ES]/.test(occ.holland[0] ?? "")) score += 2;
        if ((hex.Extraversion ?? 3) <= 2.4 && /[IC]/.test(occ.holland[0] ?? "")) score += 2;
        if ((hex.Conscientiousness ?? 3) >= 4 && /[C]/.test(occ.holland)) score += 1;
        if ((hex["Honesty-Humility"] ?? 3) >= 4 && /[S]/.test(occ.holland[0] ?? "")) score += 1;
      }
      return { occ, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((x) => x.occ);
}

export function cautionNotes(session: CapSession | null): string[] {
  const notes: string[] = [];
  const hex = session?.results.hexaco?.hexaco;
  const span = session?.results.aospan?.aospan;
  const flank = session?.results.flanker?.flanker;
  const icar = session?.results.icar?.icar;
  const interest = session?.results.interest?.interest;
  if (interest) {
    const low = RIASEC_ORDER.filter((k) => interest.means[k] <= 2.2);
    if (low.length) {
      notes.push(
        `Low interest in ${low.map((k) => RIASEC_LABEL[k]).join(", ")} — treat those lanes as “steer clear” unless something else in your life overrides the score.`,
      );
    }
  }
  if (span && span.absolute <= 8) {
    notes.push(
      "Working-memory score is modest. High dual-load jobs (air traffic, ER charge nurse, pit-trading) will feel expensive. Prefer sequential, checkable work.",
    );
  }
  if (flank && flank.costMs >= 80) {
    notes.push(
      "Flanker conflict cost is large. Roles that demand fast inhibition in noise (dispatch, combat arms, open-office sales floor) are a harder daily tax.",
    );
  }
  if (icar && icar.max && icar.total / icar.max < 0.4) {
    notes.push(
      "ICAR is in a lower band. Job Zone 5 paths (medicine, law, research faculty) are not closed, but they will cost more years of scaffolding. Zone 2–3 trades and applied technician roles are a more honest first search.",
    );
  }
  if (hex && (hex.factors.Emotionality ?? 0) >= 4.2) {
    notes.push(
      "Emotionality is high. High-volatility crisis work (EMS, corrections, collections) may fit values but will chew the nervous system. Look for structured helping, not chaos helping.",
    );
  }
  return notes;
}


