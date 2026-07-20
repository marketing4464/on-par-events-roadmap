import { NextRequest, NextResponse } from "next/server";
import { buildDashboardState } from "@/lib/roadmap";

export function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  const state = buildDashboardState();
  const openRecommendations = state.recommendations.filter((recommendation) => recommendation.status === "Needs Review");

  return NextResponse.json({
    ok: true,
    message: "Recommendation research cycle completed in dry-run seed mode. No events were approved or published.",
    generatedAt: new Date().toISOString(),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    recommendationsCreated: openRecommendations.length,
    humanApprovalRequired: true,
    recommendations: openRecommendations.map((recommendation) => ({
      id: recommendation.id,
      title: recommendation.title,
      recommendedDate: recommendation.recommendedDate,
      confidenceScore: recommendation.confidenceScore,
      status: recommendation.status
    }))
  });
}
