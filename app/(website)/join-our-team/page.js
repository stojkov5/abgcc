export const metadata = {
  title: "Join Our Team",
  description:
    "Interested in working with ABGCC? Submit your interest to join the American Balkan Global Chamber of Commerce — we connect talented professionals, students, and industry experts.",
  alternates: { canonical: "/join-our-team" },
  openGraph: {
    title: "Join Our Team | ABGCC",
    description:
      "Submit your interest in joining the American Balkan Global Chamber of Commerce.",
    url: "/join-our-team",
  },
};

import JoinTeamForm from "@/components/JoinTeamForm";
import { Reveal } from "@/components/MotionReveal";

import "@/styles/join-team.css";

export default function JoinOurTeamPage() {
  return (
    <main className="jt-page">
      <section className="jt-hero">
        <div className="page-container">
          <Reveal>
            <p className="section-label">Careers</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="jt-title">Join Our Team</h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="jt-intro">
              Interested in working with ABGCC? The American Balkan Global Chamber
              of Commerce is always interested in connecting with talented
              professionals, students, and industry experts who share our mission
              of strengthening business, investment, and cultural ties between the
              United States, the Balkans, and global markets.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="jt-body">
        <div className="page-container jt-layout">
          <Reveal className="jt-positions">
            <span className="section-label">Current Open Positions</span>
            <h2>No open positions right now.</h2>
            <p>
              We encourage interested candidates to submit their information and
              areas of interest below. We&apos;ll keep your details on file and
              notify you when relevant opportunities become available.
            </p>

            <ul className="jt-checklist">
              <li>Resume</li>
              <li>Area of expertise</li>
              <li>Desired role or internship interest</li>
              <li>Location</li>
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="jt-form-card">
            <h2>Express your interest</h2>
            <JoinTeamForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
