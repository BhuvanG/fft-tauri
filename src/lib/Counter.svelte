<script>
  let count = 0;
  const increment = () => {
    count += 1;
  };
</script>

<div class="">
  <button on:click={increment} class="btn">
    count is {count}
  </button>
</div>
