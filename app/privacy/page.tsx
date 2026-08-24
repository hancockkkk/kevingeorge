import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | Kevin George",
  description: "How the Kevin George website collects and uses information.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Kevin George"
      title="Privacy Policy"
      updated="August 24, 2026"
    >
      <p>
        This Privacy Policy explains how Kevin George ("Kevin George," "we,"
        "us," or "our") collects, uses, and shares information when you visit
        kevingeorge.xyz, join the email list, or otherwise interact with the
        website.
      </p>

      <section>
        <h2>Information We Collect</h2>
        <p>
          When you join the list, we collect the email address you provide. We
          also keep related subscription records, including when and where you
          subscribed, your consent status, and whether an email bounced, was
          reported as spam, or was unsubscribed.
        </p>
        <p>
          The site uses Vercel Web Analytics to understand aggregate traffic,
          such as pages viewed, referrers, general location, device type, and
          browser type. Vercel Web Analytics is designed without cookies and
          reports anonymized, aggregated data. The site uses local browser
          storage to remember theme preferences and whether you unlocked a full
          song preview.
        </p>
      </section>

      <section>
        <h2>How We Use Information</h2>
        <p>We use information to:</p>
        <ul>
          <li>send music, release, merchandise, show, and related updates;</li>
          <li>deliver subscriber-only or unlocked site experiences;</li>
          <li>operate, secure, maintain, and improve the website;</li>
          <li>understand aggregate site usage; and</li>
          <li>honor opt-out requests and meet legal obligations.</li>
        </ul>
      </section>

      <section>
        <h2>Service Providers</h2>
        <p>
          We use service providers to operate the site and email list,
          including Supabase for subscriber data, Resend for email delivery and
          contact management, and Vercel for hosting and privacy-focused web
          analytics. These providers process information on our behalf under
          their own terms and privacy commitments. We may also disclose
          information when required by law or to protect the rights, safety,
          and security of the site and its users.
        </p>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>Email Choices</h2>
        <p>
          You can unsubscribe at any time using the unsubscribe link in any
          marketing email. We may retain a limited suppression record after you
          unsubscribe so that we can honor your request and avoid sending
          unwanted email.
        </p>
      </section>

      <section>
        <h2>Retention and Security</h2>
        <p>
          We retain subscriber information while your subscription is active
          and as reasonably necessary to operate the site, honor opt-outs,
          resolve disputes, and comply with law. We use reasonable safeguards,
          but no method of transmission or storage is completely secure.
        </p>
      </section>

      <section>
        <h2>Your Privacy Rights</h2>
        <p>
          Depending on where you live, you may have rights to request access,
          correction, deletion, or a copy of your personal information. You may
          also withdraw consent to marketing at any time. We may need to verify
          your request before completing it.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          The site is not directed to children under 13, and we do not knowingly
          collect personal information from children under 13. If you believe a
          child submitted information, contact us so we can delete it.
        </p>
      </section>

      <section>
        <h2>International Visitors</h2>
        <p>
          The site and its service providers may process information in the
          United States and other countries, where data protection laws may
          differ from those where you live.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy as the site or our practices change. The
          updated date above shows when the latest version took effect.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For privacy questions or requests, email{" "}
          <a href="mailto:bykevingeorge@gmail.com">
            bykevingeorge@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalDocument>
  );
}

