import { useEffect, useState } from "react";
import { todayISO } from "../../lib/dates";

/** Today's local date ("YYYY-MM-DD"), kept current if the tab stays open past midnight. */
export function useToday(): string {
  const [today, setToday] = useState(todayISO);
  useEffect(() => {
    const check = () => setToday(todayISO());
    const id = window.setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  return today;
}
