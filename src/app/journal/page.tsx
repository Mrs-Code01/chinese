import type { Metadata } from "next";
import JournalCalendar from "@/components/JournalCalendar";

export const metadata: Metadata = {
  title: "Learning Journal — HanyuSprint",
  description: "Keep a daily log of what you learned in Mandarin, saved on this device.",
};

export default function JournalPage() {
  return <JournalCalendar />;
}
