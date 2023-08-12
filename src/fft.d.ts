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

