import { leadServer } from "@/modules/leads/lead.server";
import { contactRuleServer } from "@/modules/contacts/contact-rule.server";
import LeadsDashboardTabs from "@/components/admin/clientComponent/leads/LeadsDashboardTabs";
import { PageRouteHeader } from "@/components/common/PageHeader";

export default async function LeadsAdminPage() {
  const leads = await leadServer.getAllLeads();
  const rules = await contactRuleServer.list();
  const stats = await contactRuleServer.getStats();
  const leadStats = await leadServer.getStats();

  return (
    <main className="pb-8 pt-6">
      <LeadsDashboardTabs initialLeads={leads} initialRules={rules} stats={stats} leadStats={leadStats} />
    </main>
  );
}
