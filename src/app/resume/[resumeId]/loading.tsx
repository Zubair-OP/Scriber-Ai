import { SiteHeader } from "@/components/home/sections/site-header";
import { BuilderSkeleton } from "@/components/ui/Skeleton";

export default function ResumeBuilderLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />
      <main className="flex-grow pb-24">
        <BuilderSkeleton />
      </main>
    </div>
  );
}
