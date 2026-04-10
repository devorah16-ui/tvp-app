import { requirePaidAccess } from "../../utils/access";
import LeadAnalyzerClient from "../../components/LeadAnalyzerClient";

export default async function Page() {
  await requirePaidAccess();
  return <LeadAnalyzerClient />;
}