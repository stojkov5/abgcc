"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/MotionReveal";

export default function EventGallery({ images, title }) {
  const [index, setIndex] = useState(null); // null = lightbox closed
  const open = index !== null;
  const count = images.length;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i + 1) % count),
    [count]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  return (
    <>
      <Stagger className="event-gallery-grid">
        {images.map((image, i) => (
          <StaggerItem as="article" key={image.id} className="event-gallery-card">
            <button
              type="button"
              className="event-gallery-trigger"
              onClick={() => setIndex(i)}
              aria-label={`Preview image ${i + 1}`}
            >
              <div className="event-gallery-img-wrap">
                <Image
                  src={image.url}
                  alt={title}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className="event-gallery-img"
                />
                <span className="event-gallery-overlay">
                  <Expand size={18} />
                  Preview
                </span>
              </div>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      {open && (
        <div
          className="event-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          onClick={close}
        >
          <button
            type="button"
            className="event-lightbox-close"
            onClick={close}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {count > 1 && (
            <button
              type="button"
              className="event-lightbox-nav event-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div
            className="event-lightbox-stage"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index].url}
              alt={title}
              fill
              sizes="100vw"
              className="event-lightbox-img"
              priority
            />
          </div>

          {count > 1 && (
            <button
              type="button"
              className="event-lightbox-nav event-lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {count > 1 && (
            <div className="event-lightbox-count">
              {index + 1} / {count}
            </div>
          )}
        </div>
      )}
    </>
  );
}
