import {Case} from "./types";

export default {
  fetch: (): Promise<Case[]> =>
    fetch(`https://corona.lmao.ninja/v3/covid-19/countries `)
      .then((res) => res.json())
      .catch(() => Promise.reject("Error fetching data")),
};
