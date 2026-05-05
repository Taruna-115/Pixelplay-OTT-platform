import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ENDPOINTS } from "../../api/endpoints";
import { FiUser } from "react-icons/fi";

const CastCard = memo(function CastCard({ member }) {
  const profileUrl = member.profile_path
    ? ENDPOINTS.IMAGE(member.profile_path, "w185")
    : null;

  return (
    <div className="text-center flex-shrink-0 w-24">
      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-pixelplay-border mb-2
                      border-2 border-pixelplay-border hover:border-pixelplay-accent transition-colors">
        {profileUrl
          ? <img src={profileUrl} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center text-pixelplay-muted text-2xl"><FiUser /></div>
        }
      </div>
      <p className="text-xs font-semibold text-white leading-tight line-clamp-2">{member.name}</p>
      {member.character && (
        <p className="text-xs text-pixelplay-muted mt-0.5 line-clamp-1">{member.character}</p>
      )}
    </div>
  );
});

const CastSection = memo(function CastSection({ credits }) {
  const cast = credits?.cast?.slice(0, 20) || [];
  if (!cast.length) return null;

  return (
    <div className="mt-10">
      <h2 className="section-title mb-4">Cast</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView="auto"
        navigation
        grabCursor={true}
        className="w-full"
      >
        {cast.map((member) => (
          <SwiperSlide key={member.id} className="!w-auto">
            <CastCard member={member} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

export default CastSection;