import { useQuery } from "@tanstack/react-query";
import { fetchMemberByPlate } from "../api/memberApi";

export function useMemberDetail(plate, enabled) {
  return useQuery({
    queryKey: ["memberDetail", plate],
    queryFn: () => fetchMemberByPlate(plate),
    enabled: enabled && !!plate,
    staleTime: 10_000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
