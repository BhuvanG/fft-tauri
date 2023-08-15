import { writable } from "svelte/store";

export let preds = writable({});
export let predsDate = writable(new Date());
export let predsLeague = writable("Premier League")
export let matches = writable([]);
export let predsCaptain = writable({
  Azeem: 0,
  Neville: 0,
  Kautuk: 0,
});