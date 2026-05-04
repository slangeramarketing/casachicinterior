import { leadServer } from "@/modules/leads/lead.server";
import LeadTable from "@/components/admin/LeadTable";

export default async function LeadsAdminPage() {
  const leads = await leadServer.getAllLeads();

  return (
    <main>
      <LeadTable initialLeads={leads} />
    </main>
  );
}
