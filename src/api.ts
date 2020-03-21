import {Case} from "./types";

export default {
  fetch: (): Promise<Case[]> =>
    fetch(`https://corona.lmao.ninja/countries`)
      .then((res) => res.json())
      .catch(() => Promise.reject("Error fetching data")),
};
