import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { apiCheckIn, apiPreviewCheckOut, apiCheckOut } from "../api/ticketApi";

export function useCheckIn({ onSuccess } = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (plateNumber) => apiCheckIn(plateNumber),
    onSuccess: (data, vars, ctx) => {
      message.success(`Check-in berhasil untuk ${data.plateNumber}`);
      onSuccess?.(data, vars, ctx);
    },
    onError: (err) => {
      message.error(err?.message || "Check-in gagal");
    },
  });
}

export function usePreviewCheckOut(plateNumber, voucherId, options = {}) {
  const {
    enabled = true,
    retry = false,
    staleTime = 10_000,
    ...rest
  } = options;

  const plate = (plateNumber || "").toUpperCase();

  return useQuery({
    queryKey: ["previewCheckOut", plate, voucherId || ""],
    queryFn: ({ signal }) => apiPreviewCheckOut(plate, voucherId, { signal }),
    enabled: enabled && plate.length >= 3,
    retry,
    staleTime,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    ...rest,
  });
}


export function useCheckOut(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ plateNumber, voucherId }) =>
      apiCheckOut(plateNumber, voucherId),
    onSuccess: (data, vars, ctx) => {
      options.onSuccess?.(data, vars, ctx);
    },
    onError: (err, vars, ctx) => {
      options.onError?.(err, vars, ctx);
    },
    ...options,
  });
}