import type { Citation, InstrumentId } from "./types";

export const PLATFORM_CITATIONS: Citation[] = [
  {
    id: "stoet-2010",
    text: "Stoet, G. (2010). PsyToolkit: A software package for programming psychological experiments using Linux. Behavior Research Methods, 42(4), 1096–1104.",
    url: "https://doi.org/10.3758/BRM.42.4.1096",
  },
  {
    id: "stoet-2017",
    text: "Stoet, G. (2017). PsyToolkit: A novel web-based method for running online questionnaires and reaction-time experiments. Teaching of Psychology, 44(1), 24–31.",
    url: "https://doi.org/10.1177/0098628316677643",
  },
];

export const INSTRUMENT_CITATIONS: Record<InstrumentId, Citation[]> = {
  hexaco: [
    {
      id: "lee-ashton-2004",
      text: "Lee, K., & Ashton, M. C. (2004). Psychometric properties of the HEXACO personality inventory. Multivariate Behavioral Research, 39(2), 329–358.",
      url: "https://doi.org/10.1207/s15327906mbr3902_8",
    },
    {
      id: "lee-ashton-2018",
      text: "Lee, K., & Ashton, M. C. (2018). Psychometric properties of the HEXACO-100. Assessment, 25(5), 543–556.",
      url: "https://doi.org/10.1177/1073191116659134",
    },
    {
      id: "hexaco-site",
      text: "Lee, K., & Ashton, M. C. HEXACO-PI-R. https://hexaco.org/hexaco-inventory — 100-item form recommended for most research; undergraduates typically finish in 20 min (upper bound 20–25 min). HEXACO-200 (40–50 min) is a different form and is not used here.",
      url: "https://hexaco.org/hexaco-inventory",
    },
  ],
  icar: [
    {
      id: "condon-revelle-2014",
      text: "Condon, D. M., & Revelle, W. (2014). The international cognitive ability resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52–64.",
      url: "https://doi.org/10.1016/j.intell.2014.01.004",
    },
    {
      id: "icar-team",
      text: "The International Cognitive Ability Resource Team. (2014). International Cognitive Ability Resource. https://icar-project.com/ — ICAR-60 is an untimed power test (9 series, 16 verbal, 11 matrix, 24 three-dimensional rotation). Plan 45–60 minutes; spatial items take longer.",
      url: "https://icar-project.com/",
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
    ...PLATFORM_CITATIONS,
  ],
  flanker: [
    {
      id: "eriksen-1974",
      text: "Eriksen, B. A., & Eriksen, C. W. (1974). Effects of noise letters upon identification of a target letter in a non-search task. Perception & Psychophysics, 16(1), 143–149.",
      url: "https://doi.org/10.3758/BF03203267",
    },
    {
      id: "stoffels-1988",
      text: "Stoffels, E. J., & van der Molen, M. W. (1988). Effects of visual and auditory noise on visual choice reaction time in a continuous-flow paradigm. Perception & Psychophysics, 44(1), 7–14.",
      url: "https://doi.org/10.3758/BF03207468",
    },
    ...PLATFORM_CITATIONS,
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
    {
      id: "doebel-stoet-2021",
      text: "Doebel, S., Stucke, N., & Stoet, G. (2021). Dimensional Change Card Sort (online version). PsyToolkit experiment library.",
      url: "https://www.psytoolkit.org/experiment-library/dccs.html",
    },
    ...PLATFORM_CITATIONS,
  ],
  interest: [
    {
      id: "holland-1997",
      text: "Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments (3rd ed.). Psychological Assessment Resources.",
      url: "https://en.wikipedia.org/wiki/Holland_Codes",
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
    "HEXACO-PI-R 100 items © Kibeom Lee, Ph.D., & Michael C. Ashton, Ph.D. Used from researcher materials for a private, non-indexed battery. Not for public data collection. This is the 100-item form authors recommend (20–25 min). HEXACO-200 (40–50 min) is not administered — those items are not published for public apps.",
  icar:
    "ICAR letter/number and verbal items from the ICAR project (public-domain for academic use). Matrix and 3D-rotation trials in this app are local figural analogues of those item types (official bitmaps are not bundled). Full ICAR-60 count: 9 + 16 + 11 + 24.",
  aospan:
    "Procedure follows Unsworth et al. (2005): letter practice 4 sets (2,2,3,3), 15 math operations, dual practice 3 sets of size 2, then 15 scored sets (sizes 3–7 × 3). Math time cap is mean + 2.5 SD of practice first-response times. About 20 minutes.",
  flanker:
    "Arrow flanker variant as in the PsyToolkit experiment library (Eriksen protocol). 80 scored trials plus unscored practice.",
  dccs:
    "Adult online DCCS (shape then color) following Doebel, Stucke & Stoet (2021) / Zelazo (2006). 12 scored trials per rule (24 total), plus practice for each rule.",
  interest:
    "O*NET® is a trademark of the U.S. Department of Labor, Employment and Training Administration. Interest Profiler Short Form (60 items) is in the public domain. This app is not affiliated with DOL/ETA. Completion about 10–20 minutes.",
};
