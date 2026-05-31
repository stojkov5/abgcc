export default function HeroVideo({ video, poster, className = "" }) {
  return (
    <video
      className={`page-hero-img ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={video} type="video/mp4" />
    </video>
  );
}
