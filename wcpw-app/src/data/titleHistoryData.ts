export type TitleReign = {
  champion: string;
  championId?: string;
  championIds?: string[];
  start: string;
  end?: string;
  notes?: string;
};

export type TitleHistory = {
  id: string;
  name: string;
  shortName?: string;
  retired?: boolean;
  history: TitleReign[];
};

export const titleHistoryData: TitleHistory[] = [
  {
    id: "world",
    name: "WCPW Championship",
    shortName: "World",
    history: [
      { champion: "Trae Flocka", championId: "trae-flocka", start: "03/31/2025", end: "06/22/2025" },
      { champion: "Scoota Dark", championId: "scoota-dark", start: "06/22/2025", end: "07/25/2025" },
      { champion: "Trae Flocka", championId: "trae-flocka", start: "07/25/2025", end: "07/30/2025" },
      { champion: "Ray Ultimo", championId: "ray-ultimo", start: "07/30/2025", end: "10/15/2025" },
      { champion: "Roddy Rice", championId: "roddy-rice", start: "10/15/2025", end: "10/25/2025" },
      { champion: "CHIZZY", championId: "chizzy", start: "10/25/2025", end: "11/21/2025" },
      {
        champion: "Brandon Kraven",
        championId: "brandon-kraven",
        start: "11/21/2025",
        end: "11/21/2025",
        notes: "Stripped",
      },
    ],
  },

  {
    id: "universal",
    name: "World Heavyweight Championship",
    shortName: "Universal",
    history: [
      {
        champion: "“The Messiah” Adam Danger",
        championId: "adam-danger",
        start: "June 22, 2025",
        end: "June 29, 2025",
      },
      { champion: "Jamir Knight", start: "June 29, 2025", end: "July 17, 2025" },
      {
        champion: "Zach Rogue",
        championId: "zach-rogue",
        start: "July 19, 2025",
        end: "September 12, 2025",
      },
      { champion: "DeCarrion Miller", championId: "decarrion-miller", start: "09/13/2025", end: "10/10/2025" },
      { champion: "Roddy Rice", championId: "roddy-rice", start: "10/10/2025", end: "10/27/2025", notes: "Vacated" },
      { champion: "Ray Ultimo", championId: "ray-ultimo", start: "11/19/2025", end: "11/21/2025", notes: "Stripped" },
    ],
  },

  {
    id: "west-coast",
    name: "West Coast Championship",
    shortName: "West Coast",
    history: [
      { champion: "Tyler Drake", championId: "tyler-drake", start: "03/23/2025", end: "03/28/2025" },
      { champion: "Amiri Jenkins", championId: "amiri-jenkins", start: "03/31/2025", end: "06/22/2025" },
      { champion: "Tyler Drake", championId: "tyler-drake", start: "06/22/2025", end: "07/02/2025" },
      { champion: "Amiri Jenkins", championId: "amiri-jenkins", start: "07/02/2025", end: "07/29/2025", notes: "Stripped" },
      { champion: "Jimmy Harper", championId: "jimmy-harper", start: "07/30/2025", end: "10/15/2025" },
      { champion: "Adam Danger", championId: "adam-danger", start: "10/15/2025", end: "11/02/2025" },
      { champion: "Ace Riley", championId: "ace-riley", start: "11/02/2025", end: "11/21/2025", notes: "Stripped" },
    ],
  },

  {
    id: "pacific-pro",
    name: "Pacific Pro Championship",
    shortName: "Pacific Pro",
    history: [
      { champion: "Aaron Peirce", start: "04/30/2025", end: "05/07/2025" },
      { champion: "Vinji", start: "05/07/2025", end: "05/11/2025" },
      { champion: "DeCarrion Miller", championId: "decarrion-miller", start: "05/11/2025", end: "06/03/2025" },
      { champion: "Jimmy Harper", championId: "jimmy-harper", start: "06/04/2025", end: "06/22/2025" },
      { champion: "17", start: "06/22/2025", end: "07/19/2025" },
      { champion: "Kazhmir", championId: "khazmir-rulah", start: "07/19/2025", end: "08/03/2025" },
      { champion: "Eli Young", championId: "eli-young", start: "08/03/2025", end: "08/24/2025", notes: "Vacant" },
      { champion: "Jackson Stryker", start: "08/31/2025", end: "09/13/2025" },
      { champion: "Brandon Kraven", championId: "brandon-kraven", start: "09/13/2025", end: "09/23/2025" },
      { champion: "ACE RILEY", championId: "ace-riley", start: "09/23/2025", end: "09/24/2025" },
      { champion: "Brandon Kraven", championId: "brandon-kraven", start: "09/24/2025", end: "10/19/2025" },
      { champion: "DeCarrion Miller", championId: "decarrion-miller", start: "10/19/2025", end: "11/09/2025", notes: "Vacant" },
      { champion: "Jayden Hill", start: "11/16/2025", end: "11/21/2025", notes: "Stripped" },
    ],
  },

  {
    id: "tag-team",
    name: "Tag Team Championships",
    shortName: "Tag Team",
    history: [
      {
        champion: "Adam Danger & Ray Ultimo",
        championIds: ["adam-danger", "ray-ultimo"],
        start: "05/26/2025",
        end: "06/04/2025",
        notes: "Vacated",
      },
      {
        champion: "Carri (Perc 10)",
        start: "June 25, 2025",
        end: "July 13, 2025",
        notes: "Stripped",
      },
    ],
  },

  {
    id: "golden-ticket",
    name: "Golden Ticket Winner",
    shortName: "Golden Ticket",
    history: [
      {
        champion: "Scoota Dark",
        championId: "scoota-dark",
        start: "06/22/2025",
        end: "06/22/2025",
        notes: "Cashed In Same Day On Trae Flocka",
      },
      {
        champion: "Vacant",
        start: "06/22/2025",
        notes: "Cashed in same day",
      },
    ],
  },

  {
    id: "prizefighter-rumble",
    name: "Prizefighter Rumble Winner",
    shortName: "Prizefighter",
    history: [
      {
        champion: "Alex Mercer",
        championId: "alex-mercer",
        start: "09/13/2025",
        end: "11/21/2025",
      },
      {
        champion: "Vacant",
        start: "11/21/2025",
        notes: "Opportunity no longer active",
      },
    ],
  },

  {
    id: "breakout",
    name: "Breakout Championship",
    shortName: "Breakout",
    retired: true,
    history: [
      { champion: "DeCarrion Miller", championId: "decarrion-miller", start: "07/29/2025", end: "08/13/2025" },
      { champion: "El Jefe Jones", championId: "el-jefe-jones", start: "08/13/2025", end: "08/26/2025" },
      { champion: "Gramps", start: "08/26/2025", end: "09/22/2025", notes: "Vacant" },
      { champion: "Treyson Fletcher", championId: "treyson-fletcher", start: "09/30/2025", end: "10/26/2025" },
      { champion: "King Jay", start: "10/26/2025", end: "11/04/2025" },
      {
        champion: "DeCarrion Miller",
        championId: "decarrion-miller",
        start: "11/04/2025",
        end: "11/04/2025",
        notes: "Last reign — retired title after",
      },
    ],
  },

  {
    id: "hardcore",
    name: "Hardcore Championship",
    shortName: "Hardcore",
    history: [
      { champion: "Alex Mercer", championId: "alex-mercer", start: "08/10/2025", end: "10/26/2025" },
      { champion: "Ray Ultimo", championId: "ray-ultimo", start: "10/26/2025", end: "11/05/2025" },
      { champion: "Jimmy Harper", championId: "jimmy-harper", start: "11/05/2025", end: "11/19/2025" },
      { champion: "Simba", championId: "simba", start: "11/19/2025", end: "11/21/2025", notes: "Stripped" },
    ],
  },
];

export default titleHistoryData;