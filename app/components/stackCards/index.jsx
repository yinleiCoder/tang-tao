"use client";

import dynamic from "next/dynamic";
const StackCards = dynamic(() => import("./client"), { ssr: false });

export default function StackCardsClient() {
  return StackCards();
}
