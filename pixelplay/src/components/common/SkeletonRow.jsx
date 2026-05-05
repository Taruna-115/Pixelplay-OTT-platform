import SkeletonCard from "./SkeletonCard";

export default function SkeletonRow({ title }) {
  return (
    <div className="px-4 md:px-8 lg:px-12">
      <div className="h-6 w-48 skeleton-base rounded mb-3" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[130px]">
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}