interface Preds {
  [id: number]: {
    // Azeem: string;
    // Neville: string;
    // Kautuk: string;
    // matchId: number;
    // homeTeam: string;
    // homeCrest: string;
    // awayTeam: string;
    // awayCrest: string;
    // date: string;
    // check: boolean;
    [key: string]: string | number | boolean;
  };
}

interface User {
  name: string;
  color: string;
  captainColor: string;
}

interface Captain {
  [name: string]: number;
}

interface dbPredContainer {
  containerId?: number;
  startDate: string;
  endDate: string;
  predCount: number;
  wagerCount: number;
}

interface dbCaptain {
  captainId?: number;
  containerId: number;
  Azeem: number;
  Neville: number;
  Kautuk: number;
}

interface dbPred {
  matchId?: number;
  containerId: number;
  date: string;
  homeTeam: string;
  homeCrest: string;
  awayTeam: string;
  awayCrest: string;
  Azeem: string;
  Neville: string;
  Kautuk: string;
}
