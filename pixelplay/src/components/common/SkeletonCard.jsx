export default function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "2/3" }}>
      <div className="w-full h-full skeleton-base rounded-xl" />
    </div>
  );
}