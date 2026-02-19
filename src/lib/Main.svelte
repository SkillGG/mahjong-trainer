<script lang="ts">
  import { State } from "./shared.svelte";
</script>

<div class="w-full flex justify-center">Mahjong trainer!</div>
<div>
  <button
    onclick={() => {
      State.curPage = "hanfu-points";
    }}>Han-fu training</button
  >
  <button
    onclick={() => {
      State.curPage = "handvalues";
    }}>Hand points training</button
  >
</div>
