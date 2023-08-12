import Dexie, { type Table } from "dexie";



export class MySubClassedDexie extends Dexie {
  predContainer!: Table<dbPredContainer, number>;
  captain!: Table<dbCaptain, number>;
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
