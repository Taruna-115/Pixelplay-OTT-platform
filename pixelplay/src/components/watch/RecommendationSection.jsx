import { memo } from "react";
import MovieRow from "../home/MovieRow";

const RecommendationSection = memo(function RecommendationSection({ items, mediaType }) {
  return (
    <div className="mt-10 -mx-4 md:-mx-8 lg:-mx-16">
      <MovieRow title="✨ More Like This" items={items} mediaType={mediaType} />
    </div>
  );
});

export default RecommendationSection;