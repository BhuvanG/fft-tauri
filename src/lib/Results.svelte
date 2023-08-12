<script lang="ts">
  import { db } from "./db/db.js";
  import { liveQuery } from "dexie";

  let predsContainer: any = liveQuery(() => db.predContainer.toArray());
  predsContainer.subscribe({
    next: (predsContainer) => {
      console.log("predsContainer", predsContainer);
    },
  });
</script>

<div class="flex">
  <ul class=" menu bg-base-200 flex flex-col w-2/6 shadow-lg h-screen">
    {#each $predsContainer || [] as predContainer (predContainer.containerId)}
      <div class="btn">
        {predContainer.containerId}, {predContainer.startDate}
      </div>
    {/each}
  </ul>
</div>
