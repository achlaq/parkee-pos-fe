import { get } from "./http";

export function fetchMemberByPlate(plate, opts = {}) {
  const path = `/member/get/${encodeURIComponent(plate)}`;
  return get(path, opts);
}
