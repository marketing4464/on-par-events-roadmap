import { MarketingRoadmapApp } from "@/components/marketing-roadmap-app";
import { buildDashboardState } from "@/lib/roadmap";

export const dynamic = "force-dynamic";

export default function Home() {
  const initialState = buildDashboardState();
  return <MarketingRoadmapApp initialState={initialState} />;
}
