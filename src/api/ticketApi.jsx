import { post, get } from "./http";

export function apiCheckIn(plateNumber, opts) {
  return post("/ticket/check-in", { plateNumber }, opts);
}

export function apiPreviewCheckOut(plateNumber, voucherId, opts) {
  const params = new URLSearchParams();
  params.set("plateNumber", plateNumber);
  if (voucherId) params.set("voucherId", voucherId);

  return get(`/ticket/preview-check-out?${params.toString()}`, opts);
}

export function apiCheckOut(plateNumber, voucherId, opts = {}) {
  return post("/ticket/check-out", { plateNumber, voucherId }, opts);
}