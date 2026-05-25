"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function HeroVideo({
  video,
  poster,
  className = "",
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
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

      <button
        className="hero-video-toggle"
        onClick={toggleVideo}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </>
  );
}