<script lang="ts">
  import { cn } from "cn-func";

  const { options } = $props();

  function randIntIncl(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  type HanfuPoints =
    | { seat: "東"; points: number; winby: "自摸" | "ロン" }
    | ({ seat: "西" | "南" | "北" } & (
        | { winby: "自摸"; points: { dealer: number; nondealer: number } }
        | { winby: "ロン"; points: number }
      ));

  type HanfuGame = {
    han: Number;
    fu: Number;
  } & HanfuPoints;

  let results = $state<Record<"p1" | "p2" | "p3" | "p4", number | false>>({
    p1: false,
    p2: false,
    p3: false,
    p4: false,
  });

  let showResults = $state(false);

  let p1: HTMLInputElement,
    p2: HTMLInputElement,
    p3: HTMLInputElement,
    p4: HTMLInputElement;

  const focusPoints = () => {
    if (p1) p1.focus();
    else if (p3) p3.focus();
    else p4.focus();
  };

  const generateRandomHanfuGame = (focus?: boolean): HanfuGame => {
    showResults = false;
    const windTypes = ["ロン", "自摸"] as const;
    const winds = ["東", "北", "西", "南"] as const;

    const winby = windTypes[randIntIncl(0, 1)];
    const seat = winds[randIntIncl(0, 3)];

    const impossiblePoints: { han: number; fu: number; ron?: boolean }[] = [
      { han: 1, fu: 20 },
      { han: 1, fu: 25 },
      { han: 1, fu: 20 },
      { han: 2, fu: 20, ron: true },
      { han: 3, fu: 20, ron: true },
      { han: 4, fu: 20, ron: true },
      { han: 2, fu: 25, ron: false },
    ];

    let canExist = true;
    let han = 0,
      fu = 0;
    const possibleHan = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
      5, 5, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 10, 11, 12, 13, 14,
    ];
    const possibleFu = [
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 25,
      25, 25, 25, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
      30, 30, 30, 30, 30, 40, 40, 40, 40, 40, 50, 50, 50, 60, 70,
    ];
    do {
      han = possibleHan[randIntIncl(0, possibleHan.length - 1)];
      fu = possibleFu[randIntIncl(0, possibleFu.length - 1)];
      canExist = !impossiblePoints.find((impossible) => {
        if (!("ron" in impossible))
          return impossible.fu === fu && impossible.han === han;
        const isRon = winby === "ロン";
        return (
          impossible.fu === fu &&
          impossible.han === han &&
          impossible.ron === isRon
        );
      });
      console.log("Randomiuzed a game: ", `H:${han}, F:${fu}, Win: ${winby}`);
      console.log(`It ${canExist ? "can" : "cannot"} exist!`);
    } while (!canExist);

    const calcPoints = (
      han: number,
      fu: number,
      seat: HanfuPoints["seat"],
      winby: HanfuPoints["winby"],
    ) => {
      let baseP = fu * 2 ** (2 + han);

      if (fu >= 70 && han >= 3) baseP = 2000;
      if (fu >= 40 && han >= 4) baseP = 2000;
      if (han >= 5) baseP = 2000;
      if (han >= 6) baseP = 3000;
      if (han >= 8) baseP = 4000;
      if (han >= 10) baseP = 6000;
      if (han >= 13) baseP = 8000;

      if (seat !== "東" && winby === "自摸") throw "Use calcPointsX";

      let winPoints = baseP;

      if (seat !== "東") {
        winPoints = 4 * baseP;
      }

      if (seat === "東") {
        if (winby === "ロン") winPoints = 6 * baseP;
        else winPoints = 2 * baseP;
      }

      console.log("winp", winPoints);

      return Math.ceil(winPoints / 100) * 100;
    };

    const calcPointsX = (
      han: number,
      fu: number,
      seat: HanfuPoints["seat"],
      winby: HanfuPoints["winby"],
    ) => {
      if (seat === "東" || winby !== "自摸") throw "Use regular calcPoints";

      let baseP = fu * 2 ** (2 + han);

      if (fu >= 70 && han >= 3) baseP = 2000;
      if (fu >= 40 && han >= 4) baseP = 2000;
      if (han >= 5) baseP = 2000;
      if (han >= 6) baseP = 3000;
      if (han >= 8) baseP = 4000;
      if (han >= 10) baseP = 6000;
      if (han >= 13) baseP = 8000;

      console.log("basepx", baseP);

      return {
        dealer: Math.ceil((baseP * 2) / 100) * 100,
        nondealer: Math.ceil(baseP / 100) * 100,
      };
    };

    const winCondition: HanfuPoints =
      seat === "東"
        ? { seat, winby, points: calcPoints(han, fu, seat, winby) }
        : winby === "ロン"
          ? { points: calcPoints(han, fu, seat, winby), seat, winby }
          : { points: calcPointsX(han, fu, seat, winby), seat, winby };

    if (focus) {
      setTimeout(focusPoints, 0);
    }

    return {
      fu,
      han,
      ...winCondition,
    };
  };

  const checkResults = () => {
    results = { p1: false, p2: false, p3: false, p4: false };

    if (turn.winby === "自摸") {
      if (turn.seat === "東") {
        if (parseInt(p4.value) !== turn.points) results.p4 = turn.points;
      } else {
        const [p2p, p3p] = [parseInt(p2.value), parseInt(p3.value)];
        if (p2p !== turn.points.dealer) results.p2 = turn.points.dealer;
        if (p3p !== turn.points.nondealer) results.p3 = turn.points.nondealer;
      }
    } else {
      if (parseInt(p1.value) !== turn.points) results.p1 = turn.points;
    }

    showResults = true;
  };

  const newGame = () => {
    turn = generateRandomHanfuGame(true);
    if (p1) p1.value = "";
    if (p2) p2.value = "";
    if (p3) p3.value = "";
    if (p4) p4.value = "";
  };

  let turn = $state(generateRandomHanfuGame(true));
</script>

<div class=" text-lg flex flex-col gap-2 items-center">
  <div class="flex flex-row gap-6">
    <div class="text-4xl text-blue-300">{turn.seat}</div>
    <div class="text-4xl text-blue-300">{turn.winby}</div>
  </div>
  <div class="flex flex-row gap-4">
    <div class="text-2xl font-bold">Han:</div>
    <div class="text-2xl font-bold text-green-300">{turn.han}</div>
  </div>
  <div class="flex flex-row gap-4">
    <div class="text-2xl font-bold">Fu:</div>
    <div class="text-2xl font-bold text-yellow-300">{turn.fu}</div>
  </div>
  {#if turn.winby === "ロン"}
    <div>
      <label
        >Points: <input
          bind:this={p1}
          onkeydown={({ code }) => {
            if (code === "Enter") {
              if (showResults) newGame();
              else checkResults();
            }
          }}
          class="border border-x-0 border-t-0 border-b-red-400"
        />
        {#if showResults}
          <span
            class={cn("ml-4", results.p1 ? "text-red-500" : "text-green-500")}
            >{results.p1 || turn.points}</span
          >
        {/if}
      </label>
    </div>
  {:else if turn.winby === "自摸" && turn.seat !== "東"}
    <div>
      <label
        >Points (from non-daeler): <input
          bind:this={p3}
          class="border border-x-0 border-t-0 border-b-red-400"
          onkeydown={({ code }) => {
            if (code === "Enter") p2.focus();
          }}
        />
        {#if showResults}
          <span
            class={cn("ml-4", results.p3 ? "text-red-500" : "text-green-500")}
            >{results.p3 || turn.points.nondealer}</span
          >
        {/if}
      </label>
    </div>
    <div>
      <label
        >Points (from dealer): <input
          onkeydown={({ code }) => {
            if (code === "Enter") {
              if (showResults) newGame();
              else checkResults();
            }
          }}
          bind:this={p2}
          class="border border-x-0 border-t-0 border-b-red-400"
        />
        {#if showResults}
          <span
            class={cn("ml-4", results.p2 ? "text-red-500" : "text-green-500")}
            >{results.p2 || turn.points.dealer}</span
          >
        {/if}
      </label>
    </div>
  {:else}
    <div>
      <label
        >Points (from each): <input
          bind:this={p4}
          onkeydown={({ code }) => {
            if (code === "Enter") {
              if (showResults) newGame();
              else checkResults();
            }
          }}
          class="border border-x-0 border-t-0 border-b-red-400"
        />
        {#if showResults}
          <span
            class={cn("ml-4", results.p4 ? "text-red-500" : "text-green-500")}
            >{results.p4 || turn.points}</span
          >
        {/if}
      </label>
    </div>
  {/if}
  <div class="flex gap-4">
    {#if !showResults}
      <button
        onclick={() => {
          checkResults();
        }}>Check</button
      >
    {/if}
    <button
      onclick={() => {
        newGame();
      }}>New</button
    >
  </div>
</div>
