<script lang="ts">
  import { cn } from "cn-func";
  import { State } from "./shared.svelte";
  import HanfuGame from "./games/HanfuGame.svelte";

  let showOptions = $state(false);

  type HanfuOptions = {
    // add options here
  };

  let options = $state<HanfuOptions>({ testOption: false });

  const optionKey = "HanfuOpts";

  const checkOptions = (o: object): o is HanfuOptions => {
    return "testOption" in o && typeof o.testOption === "boolean";
  };

  const lSOptions = localStorage.getItem(optionKey);
  console.log("Got option", lSOptions);
  if (lSOptions && typeof lSOptions === "string") {
    const asJson = JSON.parse(lSOptions) as unknown;
    if (typeof asJson === "object" && asJson && checkOptions(asJson))
      options = asJson;
  }

  $effect(() => {
    localStorage.setItem(optionKey, JSON.stringify({ ...options }));
  });
</script>

<div class="w-full p-2 flex flex-col gap-2">
  <button
    onclick={() => (State.curPage = "main")}
    class="grow-0 shrink block self-start">Go back</button
  >
  <div class="flex px-2 justify-around w-full gap-5 h-full">
    <div
      class={cn(
        "basis-[20%] w-full min-h-75 h-full flex flexs-row gap-4",
        !showOptions && "basis-0",
      )}
    >
      <div>
        <button onclick={() => (showOptions = !showOptions)}>
          {#if showOptions}
            &lt;
          {:else}
            &gt;
          {/if}
        </button>
      </div>
      {#if showOptions}
        <div class="w-full">
          <h2 class="text-lg font-bold text-center">Options:</h2>
        </div>
      {/if}
    </div>
    <div class="basis-[75%] w-full min-h-75 grow h-full px-6">
      <HanfuGame {options} />
    </div>
  </div>
</div>
