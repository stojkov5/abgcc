import Image from "next/image";
import "@/styles/pageloader.css";

export default function PageLoader() {
  return (
    <div className="pageloader">
      {/* Top progress bar */}
      <div className="pageloader-bar" />

      <div className="pageloader-body">
        {/* Logo */}
        <div className="pageloader-logo">
          <Image
            src="/abgcc.webp"
            alt="ABGCC"
            width={120}
            height={120}
            priority
            className="pageloader-logo-img"
          />
        </div>

        {/* Dots */}
        <div className="pageloader-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
