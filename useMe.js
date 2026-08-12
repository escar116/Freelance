import { db } from "./mockDb";

import { useQuery } from "@tanstack/react-query";

export default function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => db.auth.me(),
    staleTime: 60000,
  });
}