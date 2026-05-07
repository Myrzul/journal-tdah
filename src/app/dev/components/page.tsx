import { notFound } from "next/navigation";
import { GalleryClient } from "./gallery-client";

export default function DevComponentsPage() {
  if (process.env.NEXT_PUBLIC_DEV_GALLERY !== "1") {
    notFound();
  }
  return <GalleryClient />;
}
