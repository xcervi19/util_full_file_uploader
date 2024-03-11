import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getImagesUrls } from "@/src/helpers/imageUtils";
import Gallery from "@/src/components/Gallery";

export default function GalleryPage({ params }) {
  const images = getImagesUrls(params.path);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-6">
      <p>
        file uplaod component put here 
      </p>
    </div>
  );
}
