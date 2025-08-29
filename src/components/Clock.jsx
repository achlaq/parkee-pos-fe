import { useEffect, useState } from "react";

function useCurrentTime(interval = 1000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);

  return now;
}

export default function Clock() {
  const now = useCurrentTime();

  return (
    <div>
      {new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now)}
    </div>
  );
}
