import { useEffect } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const ALERTS = [
  "Filing deadline in Indonesia is in 12 days — based on your income, you likely need to file.",
  "Singapore GST threshold approaching — consider voluntary registration before Q3.",
  "USD → IDR rate changed 1.8% this week — your tax estimate has been updated.",
];

export function AIAlertToaster() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("tb-ai-alerts-shown")) return;
    sessionStorage.setItem("tb-ai-alerts-shown", "1");

    ALERTS.forEach((msg, i) => {
      setTimeout(() => {
        toast(msg, {
          icon: <Sparkles className="h-4 w-4 text-violet-300" />,
          duration: 7000,
          className: "ai-toast",
        });
      }, 4500 + i * 5000);
    });
  }, []);
  return null;
}
