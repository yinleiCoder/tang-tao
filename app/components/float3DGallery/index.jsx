"use client";

import dynamic from "next/dynamic";
const Float3DGallery = dynamic(() => import("./client"), { ssr: false });

export default function Float3DGalleryClient() {
  return Float3DGallery();
}
