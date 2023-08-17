<script lang="ts">
  import { db } from "./db/db.js";
  import moment from "moment";
  import {
    fetch,
    type FetchOptions,
    type HttpOptions,
  } from "@tauri-apps/api/http";
  import { onMount } from "svelte";

  let preds: any = [];
  let score: any = {};
  let captain: any = [];
  let container: any;

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

  // getting the predContainer from db
  onMount(async () => {
    predsContainer = await db.predContainer.toArray();
  });

  // displaying the preds for the selected predContainer
  //
  async function showPreds(predContainerId: number) {
    preds = await db.pred
      .where("containerId")
      .equals(predContainerId)
      .toArray();

    captain = await db.captain
      .where("containerId")
      .equals(predContainerId)
      .first();

    console.log("captain", captain);
    container = await db.predContainer.get(predContainerId);
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

    let response: any = await fetch(httpString, fetchopt);

    let matches = response.data.matches;

    let totalCount: number = preds.length;
    let completedCount: number = 0;

    preds.forEach(async (pred) => {
      score[pred.matchId] = matches.find(
        (match) => match.id == pred.matchId
      ).score;
      if (score[pred.matchId].winner != "null") {
        completedCount = completedCount + 1;
        pred.completed = true;
        await db.pred.put(pred);
      }
    });
    console.log("completedCount", completedCount);
    console.log("totalCount", totalCount);
    if (totalCount == completedCount) {
      container.completed = true;
      await db.predContainer.put(container);
    }
  }
</script>

<div class="flex" style="height: 92vh;">
  <div class="flex flex-col flex-grow w-1/4">
    <ul class="menu flex-grow bg-base-200 shadow-lg">
      {#each predsContainer || [] as predContainer (predContainer.containerId)}
        <button
          class="btn text-xl bg-base-100"
          on:click={() => showPreds(predContainer.containerId)}
        >
          {predContainer.containerId}: {moment(predContainer.startDate).format(
            "DD/MM/YYYY"
          )} to {moment(predContainer.endDate).format("DD/MM/YYYY")}
        </button>
      {/each}
    </ul>
  </div>
  <div class="w-3/4 overflow-auto">
    <div class="flex w-10/12 m-auto text-2xl my-8">
      <p class="my-auto">Status:</p>
      {#if container}
        {#if container.completed == true}
          <p class="text-green-500 my-auto">Completed</p>
          <button class="btn btn-success my-auto mx-auto"
            >Calculate Score</button
          >
        {:else}
          <p class="text-red-500">Not Completed</p>
        {/if}
      {/if}
    </div>
    <div
      class="grid grid-cols-newGrid text-center text-black border m-auto h-10 w-11/12 bg-slate-500"
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
        class="grid grid-cols-newGrid text-center m-auto text-black border w-11/12 bg-slate-500"
      >
        <p class="m-auto">*</p>
        <div class="grid grid-cols-1 p-4 text-center">
          <img class="m-auto w-7 h-7" src={pred.homeCrest} alt="" />
          <p class="m-auto">{pred.homeTeam}</p>
        </div>
        <div class="grid grid-cols-1 p-4 text-center">
          <img class="m-auto w-7 h-7" src={pred.awayCrest} alt="" />
          <p class="m-auto">{pred.awayTeam}</p>
        </div>
        <p class="m-auto font-bold text-xl">
          {score[pred.matchId]
            ? score[pred.matchId].fullTime.home +
              " - " +
              score[pred.matchId].fullTime.away
            : ""}
        </p>
        {#each users as user, i}
          <div
            class="grid m-auto w-full h-full {user.color} {captain[user.name] ==
            pred.matchId
              ? user.captainColor
              : ''}"
          >
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

<style>
  /* animating the captained pred background */
  .background-animate {
    background-size: 400%;

    -webkit-animation: AnimationName 3s ease infinite;
    -moz-animation: AnimationName 3s ease infinite;
    animation: AnimationName 3s ease infinite;
  }

  @keyframes AnimationName {
    0%,
    100% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }
  }
</style>
