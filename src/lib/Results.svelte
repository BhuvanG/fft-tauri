<script lang="ts">
  import { db } from "./db/db.js";
  import { liveQuery } from "dexie";

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

  let preds: any;
  let predsContainer: any = liveQuery(() => db.predContainer.toArray());
  predsContainer.subscribe({
    next: (predsContainer) => {
      console.log("predsContainer", predsContainer);
    },
  });
  async function showPreds(predContainerId: number) {
    preds = liveQuery(() =>
      db.pred.where("containerId").equals(predContainerId).toArray()
    );
    preds.subscribe({
      next: (preds) => {
        console.log("preds", preds);
      },
    });
  }
</script>

<div class="flex" style="height: 92vh;">
  <div class="flex flex-col flex-grow w-1/4">
    <ul class="menu flex-grow bg-base-200 shadow-lg">
      {#each $predsContainer || [] as predContainer (predContainer.containerId)}
        <button
          class="btn"
          on:click={() => showPreds(predContainer.containerId)}
        >
          {predContainer.containerId}, {predContainer.startDate}
        </button>
      {/each}
    </ul>
  </div>
  <div class="w-3/4 overflow-auto">
    <div
      class="grid grid-cols-newGrid text-center text-black border m-auto h-10 w-5/6 bg-slate-500"
    >
      <p class="m-auto">Status</p>
      <p class="m-auto">Home Team</p>
      <p class="m-auto">Away Team</p>
      <p class="m-auto">Date</p>
      {#each users as user, i}
        <div class="grid m-auto w-full h-full {user.color}">
          <p class="m-auto">{user.name}</p>
        </div>
      {/each}
    </div>
    {#each $preds || [] as pred (pred.matchId)}
      <div
        class="grid grid-cols-newGrid text-center m-auto text-black border h-16 w-5/6 bg-slate-500"
      >
        <p class="m-auto">*</p>
        <p class="m-auto">{pred.homeTeam}</p>
        <p class="m-auto">{pred.awayTeam}</p>
        <p class="m-auto">{pred.utcDate}</p>
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
