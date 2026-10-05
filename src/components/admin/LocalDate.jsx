"use client";

import { useSyncExternalStore } from "react";
import { formatDate, formatTime } from "@/lib/admin/requests";

const noop = () => () => {};

// false during SSR + hydration, true right after — lets us render dates in UTC
// for a deterministic first paint and switch to the admin's local zone without
// hydration warnings.
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function useTimeZone() {
  const hydrated = useHydrated();
  return hydrated ? undefined : "UTC";
}

export default function LocalDate({ value, short = false, withTime = false, className }) {
  const timeZone = useTimeZone();
  if (!value) return null;
  return (
    <time dateTime={new Date(value).toISOString()} className={className}>
      {formatDate(value, { timeZone, short })}
      {withTime && <> · {formatTime(value, { timeZone })}</>}
    </time>
  );
}

export function LocalTime({ value, className }) {
  const timeZone = useTimeZone();
  if (!value) return null;
  return (
    <time dateTime={new Date(value).toISOString()} className={className}>
      {formatTime(value, { timeZone })}
    </time>
  );
}
