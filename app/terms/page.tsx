import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms | Kevin George",
  description: "Terms for using the official Kevin George website.",
};

export default function TermsPage() {
  return (
    <LegalDocument eyebrow="Kevin George" title="Terms" updated="August 24, 2026">
      <p>
        These Terms govern your use of kevingeorge.xyz and its music players,
        email signup, links, media, and other features. By using the site, you
        agree to these Terms. If you do not agree, do not use the site.
      </p>

      <section>
        <h2>Using the Site</h2>
        <p>
          You may use the site for personal, non-commercial purposes. You agree
          not to interfere with the site, attempt unauthorized access, misuse
          signup or communication features, introduce malicious code, scrape
          the site at unreasonable volume, or use the site in violation of law.
        </p>
      </section>

      <section>
        <h2>Music and Other Content</h2>
        <p>
          Music, recordings, videos, artwork, text, names, logos, and other
          content on the site are owned by Kevin George or the applicable
          artists, labels, licensors, and rights holders. Access to a preview or
          full stream does not transfer ownership or grant permission to copy,
          download, distribute, sell, publicly perform, modify, or commercially
          exploit that content except as allowed by law or with written
          permission from the applicable rights holder.
        </p>
      </section>

      <section>
        <h2>Email Updates</h2>
        <p>
          If you join the email list, you authorize us to send updates about
          music, releases, merchandise, shows, and related news to the email
          address you provide. You can unsubscribe at any time through the link
          included in each marketing email. You are responsible for providing
          an email address that belongs to you and for keeping it accurate.
        </p>
      </section>

      <section>
        <h2>Third-Party Services</h2>
        <p>
          The site may link to or embed services operated by third parties,
          including streaming, video, commerce, and social platforms. Their
          services are governed by their own terms and privacy policies. We are
          not responsible for third-party content, availability, security, or
          practices.
        </p>
      </section>

      <section>
        <h2>Availability and Changes</h2>
        <p>
          We may change, suspend, remove, or restrict any part of the site at
          any time. We do not promise that the site or any particular song,
          feature, link, or release will always be available or error-free.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>
          The site is provided "as is" and "as available." To the fullest
          extent permitted by law, we disclaim warranties of merchantability,
          fitness for a particular purpose, non-infringement, and uninterrupted
          or error-free operation.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Kevin George and those working
          on the site will not be liable for indirect, incidental, special,
          consequential, or punitive damages, or for loss of data, profits, or
          access arising from your use of or inability to use the site. Nothing
          in these Terms limits liability that cannot legally be limited.
        </p>
      </section>

      <section>
        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms as the site changes. Continued use after an
          update means you accept the revised Terms. The updated date above
          identifies the current version.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these Terms can be sent to{" "}
          <a href="mailto:bykevingeorge@gmail.com">
            bykevingeorge@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalDocument>
  );
}

