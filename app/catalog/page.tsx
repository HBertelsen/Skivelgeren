import { redirect } from "next/navigation";
import { CURRENT_SEASON } from "@/data/constants";

export default function CatalogIndexPage() {
  redirect(`/catalog/${CURRENT_SEASON}`);
}
