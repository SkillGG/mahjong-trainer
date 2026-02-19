<script lang="ts">
  import { State } from "./lib/shared.svelte";

  import Main from "./lib/Main.svelte";
  import Hands from "./lib/Hands.svelte";
  import Hanfu from "./lib/Hanfu.svelte";

  $effect(() => {
    window.history.replaceState("", "", "?page=" + State.curPage);
  });
</script>

<main>
  {#if State.curPage === "hanfu-points"}
    <Hanfu />
  {:else if State.curPage === "handvalues"}
    <Hands />
  {:else}
    <Main />
  {/if}
</main>

<style>
  @reference "tailwindcss";
</style>
