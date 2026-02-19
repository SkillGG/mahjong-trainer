import queryString from "query-string";

type PageType = "main" | "handvalues" | "hanfu-points";

export const State = $state<{
  curPage: PageType;
}>({ curPage: "main" });

const curSearch = queryString.parse(window.location.search);

const isPageCorrect = (p: unknown): p is PageType => {
  if (typeof p === "string")
    return ["main", "handvalues", "hanfu-points"].includes(p);
  return false;
};

if (isPageCorrect(curSearch.page)) {
  State.curPage = curSearch.page;
}
