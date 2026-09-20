import type { Citation, InstrumentId } from "./types";

export const INSTRUMENT_CITATIONS: Record<InstrumentId, Citation[]> = {
  hexaco: [
    {
      id: "ashton-lee-goldberg-2007",
      text: "Ashton, M. C., Lee, K., & Goldberg, L. R. (2007). The IPIP–HEXACO scales: An alternative, public-domain measure of the personality constructs in the HEXACO model. Personality and Individual Differences, 42(8), 1515–1526.",
      url: "https://doi.org/10.1016/j.paid.2006.10.026",
    },
    {
      id: "ipip-permission",
      text: "International Personality Item Pool (IPIP). Public-domain items; commercial use allowed without written permission. https://ipip.ori.org/newPermission.htm",
      url: "https://ipip.ori.org/newPermission.htm",
    },
    {
      id: "ipip-hexaco-key",
      text: "IPIP scales measuring constructs similar to HEXACO domains: https://ipip.ori.org/newHEXACO_PI_key.htm — iCAP administers a 60-item IPIP domain form (10 items per factor). This is not HEXACO-PI-R and not an ICAR instrument.",
      url: "https://ipip.ori.org/newHEXACO_PI_key.htm",
    },
  ],
  icar: [
    {
      id: "icap-cognition",
      text: "iCAP problem-solving set (original series, verbal, and figural items). Matrix and die-rotation figures are original generative analogues. Not the International Cognitive Ability Resource (ICAR).",
    },
    {
      id: "condon-revelle-2014",
      text: "Condon, D. M., & Revelle, W. (2014). The international cognitive ability resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52–64. Related research only — iCAP does not administer ICAR items.",
      url: "https://doi.org/10.1016/j.intell.2014.01.004",
    },
  ],
  aospan: [
    {
      id: "unsworth-2005",
      text: "Unsworth, N., Heitz, R. P., Schrock, J. C., & Engle, R. W. (2005). An automated version of the operation span task. Behavior Research Methods, 37(3), 498–505.",
      url: "https://doi.org/10.3758/BF03192720",
    },
    {
      id: "turner-engle-1989",
      text: "Turner, M. L., & Engle, R. W. (1989). Is working memory capacity task-dependent? Journal of Memory and Language, 28(2), 127–154.",
      url: "https://doi.org/10.1016/0749-596X(89)90040-5",
    },
  ],
  flanker: [
    {
      id: "eriksen-1974",
      text: "Eriksen, B. A., & Eriksen, C. W. (1974). Effects of noise letters upon identification of a target letter in a non-search task. Perception & Psychophysics, 16(1), 143–149.",
      url: "https://doi.org/10.3758/BF03203267",
    },
  ],
  dccs: [
    {
      id: "zelazo-2006",
      text: "Zelazo, P. D. (2006). The Dimensional Change Card Sort (DCCS): A method of assessing executive function in children. Nature Protocols, 1, 297–301.",
      url: "https://doi.org/10.1038/nprot.2006.46",
    },
    {
      id: "doebel-zelazo-2015",
      text: "Doebel, S., & Zelazo, P. D. (2015). A meta-analysis of the Dimensional Change Card Sort: Implications for developmental theories and the measurement of executive function in children. Developmental Review, 38, 241–268.",
      url: "https://doi.org/10.1016/j.dr.2015.09.001",
    },
  ],
  interest: [
    {
      id: "holland-1997",
      text: "Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments (3rd ed.). Psychological Assessment Resources.",
    },
    {
      id: "rounds-2010",
      text: "Rounds, J., Su, R., Lewis, P., & Rivkin, D. (2010). O*NET Interest Profiler Short Form psychometric characteristics: Summary. National Center for O*NET Development.",
      url: "https://www.onetcenter.org/reports/IPSF_Psychometric.html",
    },
    {
      id: "onet-ip",
      text: "National Center for O*NET Development. O*NET Interest Profiler. https://www.onetcenter.org/IP.html — Short Form is 60 activities; completion about 10–20 minutes.",
      url: "https://www.onetcenter.org/IP.html",
    },
    {
      id: "mynextmove",
      text: "U.S. Department of Labor / ETA. My Next Move. https://www.mynextmove.org/",
      url: "https://www.mynextmove.org/",
    },
  ],
};

export const COPYRIGHT_NOTES: Record<InstrumentId, string> = {
  hexaco:
    "IPIP six-factor work-style inventory (60 public-domain IPIP items representing HEXACO constructs; Ashton, Lee & Goldberg, 2007). Not HEXACO-PI-R. Commercial use of IPIP items is allowed without written permission (ipip.ori.org).",
  icar:
    "iCAP problem-solving set: original series and verbal items plus original generative matrix and die-rotation figures. Not ICAR / not ICAR-60. Figural items are iCAP analogues, not official ICAR bitmaps.",
  aospan:
    "Operation span procedure (Unsworth et al., 2005): letter practice 4 sets (2,2,3,3), 15 math operations, dual practice 3 sets of size 2, then 15 scored sets (sizes 3–7 × 3). Math time cap is mean + 2.5 SD of practice first-response times. Letters and math are generated in-app.",
  flanker:
    "Original iCAP arrow flanker following the Eriksen & Eriksen (1974) conflict method. 80 scored trials plus unscored practice.",
  dccs:
    "Original iCAP dimensional card-sort (shape then color) following Zelazo (2006) methods. 12 scored trials per rule (24 total), plus practice. Rabbit/boat stimuli are original SVGs.",
  interest:
    "O*NET® is a trademark of the U.S. Department of Labor, Employment and Training Administration. Interest Profiler Short Form (60 items) is in the public domain. This app is not affiliated with DOL/ETA. Career exploration / counseling only — never hiring or screening.",
};
