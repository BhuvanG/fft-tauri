<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import Counter from "./Counter.svelte";
  import Preds from "./Preds.svelte";
  import Results from "./Results.svelte";

  let activePage: string = "Home";
</script>

<Router>
  <div class="navbar bg-base-200">
    <p class="my-auto text-red-500">442</p>
    <Link
      to="/"
      class="btn btn-ghost m-auto {activePage == 'Home' ? 'btn-active' : ''} "
      on:click={() => (activePage = "Home")}>Home</Link
    >
    <Link
      to="counter"
      class=" btn btn-ghost m-auto {activePage == 'Counter'
        ? 'btn-active'
        : ''} "
      on:click={() => (activePage = "Counter")}>Counter</Link
    >
    <Link
      to="preds"
      class="btn btn-ghost m-auto {activePage == 'Preds' ? 'btn-active' : ''}"
      on:click={() => (activePage = "Preds")}>Preds</Link
    >
    <Link
      to="results"
      class="btn btn-ghost m-auto {activePage == 'Results'
        ? 'btn-active'
        : ''} "
      on:click={() => (activePage = "Results")}>Results</Link
    >
  </div>
  <div>
    <Route path="/">
      <Home />
    </Route>
    <Route path="home" component={Home} />
    <Route path="counter" component={Counter} />
    <Route path="preds" component={Preds} />
    <Route path="results" component={Results} />
  </div>
</Router>
