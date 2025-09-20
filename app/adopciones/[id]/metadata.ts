import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.client";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const docRef = doc(db, "pigs", params.id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return {};

  const pig = snap.data();
  const title = `Mini Pig ${pig.name} en adopción`;
  const description = pig.description || "Conoce este mini cerdito disponible para adopción.";
  const image = pig.images?.[0] || "/og-default.jpg"; // Asegúrate de tener esta imagen en /public

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
