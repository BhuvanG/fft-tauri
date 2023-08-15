import Dexie, { type Table } from "dexie";

export interface dbPredContainer {
  containerId?: number;
  startDate: string;
  endDate: string;
  predCount: number;
  wagerCount: number;
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

}

export class MySubClassedDexie extends Dexie {
  predContainer!: Table<dbPredContainer, number>;
  pred!: Table<dbPred, number>;

  constructor() {
    super("fttDatabase");
    this.version(1).stores({
      predContainer: "++containerId, startDate, endDate, predCount, wagerCount",
      captain: "++captainId, containerId, Azeem, Neville, Kautuk",
      pred: "matchId,containerId, date, homeTeam, homeCrest, awayTeam, awayCrest, Azeem, Neville, Kautuk",
    });
  }
}

export const db = new MySubClassedDexie();
