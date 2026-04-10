import LeadAnalyzerClient from "../../components/LeadAnalyzerClient";
import { requirePaidAccess } from "../../utils/access";

export default async function LeadAnalyzerPage() {
  await requirePaidAccess();
  return <LeadAnalyzerClient />;
}