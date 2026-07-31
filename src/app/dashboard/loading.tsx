import { SiteHeader } from "@/components/home/sections/site-header";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />
      <main className="flex-grow pt-32 pb-24 px-4 md:px-10 max-w-[1200px] mx-auto w-full">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
