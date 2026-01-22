import React from 'react';
import AnalyticsDashboard from '@/components/admin/clientComponent/dashboard/AnalyticsDashboard';

// Helper function: Absolute URL nikalne ke liye
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000'; // Local development ke liye
};

export default async function DashboardHomeServerPage() {
  const baseUrl = getBaseUrl();
  
  // 1. Data fetching - direct humare API route ko call kar rahe hain
  const res = await fetch(`${baseUrl}/api/analytics/google-ga4`, {
    cache: 'no-store', // Taki humesha fresh data mile
  });

  if (!res.ok) {
    return <div>Failed to load analytics data.</div>;
  }

  const data = await res.json();

  return (
    <main>
      {/* 2. Data ko pass kar rahe hain Client Component mein */}
      <AnalyticsDashboard data={data} />
    </main>
  );
}