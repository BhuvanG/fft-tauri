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
  <div class="flex flex-col w--2/6">
    {#each $predsContainer || [] as predContainer (predContainer.containerId)}
      <li>{predContainer.containerId}, {predContainer.startDate}</li>
    {/each}
  </div>
</div>
