import React from "react";

import {Case} from "./types";
import api from "./api";

export function useCases() {
  const [cases, setCases] = React.useState<Case[] | null>(null);
  const [status, setStatus] = React.useState("pending");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    api
      .fetch()
      .then(setCases)
      .catch(setError)
      .finally(() => setStatus("resolved"));
  }, []);

  return {data: cases, loading: status === "pending", error};
}
