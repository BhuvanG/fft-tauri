import Dexie, { type Table } from "dexie";

export interface dbPredContainer {
  containerId?: number;
  startDate: string;
  endDate: string;
  predCount: number;
  wagerCount: number;
  completed: boolean;
}

export interface dbCaptain {
  captainId?: number;
  containerId: number;
  Azeem: number;
  Neville: number;
  Kautuk: number;
}

export interface dbPred {
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
  completed: boolean;
}

export class MySubClassedDexie extends Dexie {
  predContainer!: Table<dbPredContainer, number>;
  captain!: Table<dbCaptain, number>;
  pred!: Table<dbPred, number>;

  constructor() {
    super("fttDatabase");
    this.version(1).stores({
      predContainer: "++containerId, startDate, endDate, predCount, wagerCount, completed",
      captain: "++captainId, containerId, Azeem, Neville, Kautuk",
      pred: "matchId,containerId, date, homeTeam, homeCrest, awayTeam, awayCrest, Azeem, Neville, Kautuk, completed",
    });
  }
}

export const db = new MySubClassedDexie();
