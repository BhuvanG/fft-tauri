<script lang="ts">
  import Fixtures from "./matches.json";
  import moment from "moment";
  import Swal from "sweetalert2";
  import { db } from "./db/db.js";
  import {
    fetch,
    type FetchOptions,
    type HttpOptions,
  } from "@tauri-apps/api/http";

  let preds: Preds = {}; // setting the preds
  let matches: any[]; // mathches need to be empty any array
  let currentDate: string = moment(new Date()).format("YYYY-MM-DD"); //getting the current date

  // the football data api only allow interval to 10 days
  let lastDate: string = moment(new Date())
    .add(10, "days")
    .format("YYYY-MM-DD"); //getting the date after 10 days
  let currentLeague: string = "Premier League"; // setting the default league to Premier League

  // setting the captain
  let captain: Captain = {
    Azeem: 0,
    Neville: 0,
    Kautuk: 0,
  };

  // setting the users with name and color
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

  // setting the leagues
  const leagues: string[] = [
    "Premier League",
    "Bundesliga",
    "Primera Division",
    "UEFA Champions League",
  ];

  // getting data when date changes
  function checkStatus(id: number) {
    if (preds[id].Azeem && preds[id].Neville && preds[id].Kautuk) {
      preds[id].check = true;
    } else {
      preds[id].check = false;
      for (let user in users) {
        if (captain[users[user].name] == id) {
          captain[users[user].name] = 0;
        }
      }
    }
  }

  function handleCaptain(id: number, user: string) {
    if (preds[id].check == true) {
      if (captain[user] == id) {
        captain[user] = 0;
      } else {
        captain[user] = id;
      }
    }
  }
  function reset() {
    // for (let id in preds) {
    //   preds[id].Azeem = "";
    //   preds[id].Neville = "";
    //   preds[id].Kautuk = "";
    //   preds[id].check = false;
    // }
    matches = [];
  }

  async function handleDate() {
    // let header: Record<string, any> = {
    //   "X-Auth-Token": "49185e58260b4576ab876d47977111cc",
    // };
    // let httpopt: HttpOptions = {
    //   method: "GET",
    //   url: "https://api.football-data.org/v4/matches/?dateFrom=2023-08-08&dateTo=2023-08-14",
    //   headers: header,
    // };

    // let fetchopt: FetchOptions = {
    //   method: "GET",
    //   headers: header,
    // };
    // const response: any = await fetch(
    //   "https://api.football-data.org/v4/matches/?dateFrom=2023-08-08&dateTo=2023-08-14",
    //   fetchopt
    // );
    // matches = response.data.matches;
    // matches.forEach((match) => {
    //   if (leagues.includes(match.competition.name))
    //     preds[match.id] = {
    //       Azeem: "",
    //       Neville: "",
    //       Kautuk: "",
    //       matchId: match.id,
    //       homeTeam: match.homeTeam.name,
    //       homeCrest: match.homeTeam.crest,
    //       awayTeam: match.awayTeam.name,
    //       awayCrest: match.awayTeam.crest,
    //       date: match.utcDate,
    //       check: false,
    //     }; // setting the preds
    // });
    // showPreds = true;

    matches = Fixtures.matches;
    matches.forEach((match) => {
      if (leagues.includes(match.competition.name)) {
        preds[match.id] = {
          Azeem: "",
          Neville: "",
          Kautuk: "",
          matchId: match.id,
          homeTeam: match.homeTeam.name,
          homeCrest: match.homeTeam.crest,
          awayTeam: match.awayTeam.name,
          awayCrest: match.awayTeam.crest,
          date: match.utcDate,
          check: false,
        }; // setting the preds
      }
    });
  }

  // changin color of status

  async function submitPreds() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Cancel`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (captain.Azeem == 0 || captain.Neville == 0 || captain.Kautuk == 0) {
          Swal.fire("Please select a captain each player", "", "error");
          return;
        }
        try {
          let filteredPreds = Object.values(preds).filter((pred) => pred.check);
          let count = filteredPreds.length;
          let newContainer = await db.predContainer.add({
            startDate: "2023-08-08",
            endDate: "2023-08-14",
            predCount: count,
            wagerCount: 0,
          });
          for (let pred in filteredPreds) {
            await db.pred.add({
              ...filteredPreds[pred],
              containerId: newContainer,
            });
          }
        } catch (err) {
          console.log(err);
        }
        Swal.fire("Saved!", "", "success");
      }
    });
  }
  handleDate();
</script>

<div class="overflow-auto">
  <div class="flex w-10/12 m-auto gap-5 my-5">
    <div class=" w-1/4">
      <input
        type="date"
        class="text-base bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Select date"
        min="2023-08-10"
        max={lastDate}
        on:change={handleDate}
      />
    </div>
    <select
      id="leagues"
      class="select select-bordered bg-cyan-500 text-black"
      bind:value={currentLeague}
    >
      {#each leagues as league}
        <option value={league}>{league}</option>
      {/each}
    </select>
    <button class="btn btn-success" on:click={submitPreds}>Submit</button>
    <button class="btn btn-error" on:click={reset}>Reset</button>
  </div>

  <div
    class="grid grid-cols-newGrid text-black border m-auto h-10 w-10/12 bg-slate-500"
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

  {#each matches || [] as match}
    {#if match.competition.name == currentLeague}
      <div class="grid grid-cols-newGrid m-auto w-10/12 border bg-slate-800">
        <span
          class="flex m-auto w-3 h-3 {preds[match.id].check
            ? 'bg-lime-400'
            : 'bg-slate-200'} rounded-full"
        />
        <div class="grid grid-cols-1 p-4 text-center">
          <img class="m-auto w-7 h-7" src={match.homeTeam.crest} alt="" />
          <p class="m-auto">{match.homeTeam.name}</p>
        </div>
        <div class="grid grid-cols-1 p-4 text-center">
          <img class="m-auto w-7 h-7" src={match.awayTeam.crest} alt="" />
          <p class="m-auto">{match.awayTeam.name}</p>
        </div>
        <div class="grid">
          <p class="m-auto">
            {moment.utc(match.utcDate).local().format("DD-MM-YYYY")}
          </p>
          <p class="m-auto">
            {moment.utc(match.utcDate).local().format("dddd")}
          </p>
          <p class="m-auto">
            {moment.utc(match.utcDate).local().format("HH:mm")}
          </p>
        </div>
        {#each users as user, i}
          <div
            class="grid w-full h-full {user.color} {captain[user.name] ==
            match.id
              ? user.captainColor
              : ''}"
          >
            <select
              class="bg-slate-400 w-10/12 m-auto text-black"
              name={user.name}
              id={match.id}
              bind:value={preds[match.id][user.name]}
              on:change={() => checkStatus(match.id)}
            >
              <option value="" />
              <option value="homeTeam"> {match.homeTeam.name}</option>
              <option value="awayTeam">{match.awayTeam.name}</option>
              <option value="draw">DRAW</option>
            </select>
            <button
              class="m-auto w-4 h-4 text-white text-center text-xs bg-slate-800 shadow rounded"
              on:click={() => handleCaptain(match.id, user.name)}>C</button
            >
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style>
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
