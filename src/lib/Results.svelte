<script lang="ts">
  import { db } from "./db/db.js";
  import { liveQuery } from "dexie";
  import {
    fetch,
    type FetchOptions,
    type HttpOptions,
  } from "@tauri-apps/api/http";
  import { onMount } from "svelte";

  let preds: any = [];
  let score: any = {};

  const users: User[] = [
    {
      name: "Azeem",
      color: "bg-red-700",
      captainColor:
        "bg-gradient-to-r from-pink-500 via-red-500 to-fuchsia-500 background-animate",
    },
    {
      name: "Neville",
      color: "bg-blue-700",
      captainColor:
        "bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 background-animate",
    },
    {
      name: "Kautuk",
      color: "bg-white",
      captainColor:
        "bg-gradient-to-r from-green-100 via-yellow-200 to-sky-400 background-animate",
    },
  ];
  let predsContainer: any;

  onMount(async () => {
    predsContainer = await db.predContainer.toArray();
  });

  async function showPreds(predContainerId: number) {
    preds = await db.pred
      .where("containerId")
      .equals(predContainerId)
      .toArray();

    let container = await db.predContainer.get(predContainerId);
    let startDate = container.startDate;
    let endDate = container.endDate;
    let idString: string = "";
    preds.forEach((pred) => {
      idString += pred.matchId + ",";
    });
    idString = idString.slice(0, -1);
    let header: Record<string, any> = {
      "X-Auth-Token": "49185e58260b4576ab876d47977111cc",
    };

    let fetchopt: FetchOptions = {
      method: "GET",
      headers: header,
    };
    let httpString =
      "https://api.football-data.org/v4/matches/?ids=" + idString;
    console.log("httpString", httpString);
    let response: any = await fetch(httpString, fetchopt);
    let matches = response.data.matches;
    // preds.subscribe({
    //   next: async (arr_preds) => {
    //     arr_preds.forEach(async (pred) => {
    //       score[pred.matchId] = response.data.score;
    //       console.log(score[pred.matchId].fullTime.home);
    //       console.log("score", score);
    //     });
    //   },
    // });
    preds.forEach((pred) => {
      score[pred.matchId] = matches.find(
        (match) => match.id == pred.matchId
      ).score;
    });
    console.log("score", score);
  }
</script>

<div class="flex" style="height: 92vh;">
  <div class="flex flex-col flex-grow w-1/4">
    <ul class="menu flex-grow bg-base-200 shadow-lg">
      {#each predsContainer || [] as predContainer (predContainer.containerId)}
        <button
          class="btn"
          on:click={() => showPreds(predContainer.containerId)}
        >
          {predContainer.containerId}, {predContainer.startDate}
        </button>
      {/each}
    </ul>
  </div>
  <div class="w-3/4 overflow-auto my-10">
    <div
      class="grid grid-cols-newGrid text-center text-black border m-auto h-10 w-5/6 bg-slate-500"
    >
      <p class="m-auto">Status</p>
      <p class="m-auto">Home Team</p>
      <p class="m-auto">Away Team</p>
      <p class="m-auto">Score</p>
      {#each users as user, i}
        <div class="grid m-auto w-full h-full {user.color}">
          <p class="m-auto">{user.name}</p>
        </div>
      {/each}
    </div>
    {#each preds || [] as pred (pred.matchId)}
      <div
        class="grid grid-cols-newGrid text-center m-auto text-black border h-16 w-5/6 bg-slate-500"
      >
        <p class="m-auto">*</p>
        <p class="m-auto">{pred.homeTeam}</p>
        <p class="m-auto">{pred.awayTeam}</p>
        <p class="m-auto">
          {score[pred.matchId]
            ? score[pred.matchId].fullTime.home +
              " - " +
              score[pred.matchId].fullTime.away
            : ""}
        </p>
        {#each users as user, i}
          <div class="grid m-auto w-full h-full {user.color}">
            <p class="m-auto">
              {pred[user.name] == "homeTeam"
                ? pred.homeTeam
                : pred[user.name] == "awayTeam"
                ? pred.awayTeam
                : "Draw"}
            </p>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
