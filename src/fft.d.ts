interface Preds {
  [id: number]: {
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

