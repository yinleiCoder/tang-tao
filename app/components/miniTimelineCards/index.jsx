"use client";

import dynamic from "next/dynamic";
const MiniTimelineCards = dynamic(() => import("./client"), { ssr: false });

export default function MiniTimelineCardsClient() {
  return MiniTimelineCards();
}
