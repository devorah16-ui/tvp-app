import { redirect } from "next/navigation";
import { requirePaidAccess } from "../../utils/access";

export default async function DashboardPage() {
  await requirePaidAccess();

  redirect("/lead-analyzer");
}