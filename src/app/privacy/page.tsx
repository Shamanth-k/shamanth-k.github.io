import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the Shamanth Krishna V R portfolio website, including information about Google Analytics and visitor privacy.",
  alternates: {
    canonical: "/privacy/",
  },
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <article className="privacy-content">
        <Link href="/" className="privacy-back">
          ← Back to portfolio
        </Link>

        <h1>Privacy Policy</h1>
        <p className="privacy-updated">Last updated: October 29, 2026</p>

        <p>
          This Privacy Policy explains how the Shamanth Krishna V R portfolio
          website collects and uses information when you visit
          https://shamanth-k.github.io/.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          This website does not ask visitors to create an account. However,
          certain technical information may be processed when you visit the
          website, including information about your browser, device, pages
          viewed, approximate location derived from your IP address, and how you
          interact with the site.
        </p>

        <h2>2. Google Analytics</h2>
        <p>
          This website uses Google Analytics 4 to understand website traffic and
          improve the visitor experience. Google Analytics may use cookies or
          similar technologies to collect information about visits, page views,
          interactions, browser and device information, and traffic sources.
        </p>
        <p>
          Google processes analytics data in accordance with its own policies.
          For more information, read the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
          .
        </p>

        <h2>3. Cookies and Tracking Choices</h2>
        <p>
          Google Analytics may use cookies or similar technologies. You can
          restrict cookies through your browser settings. Browser privacy
          controls and ad-blocking tools may also affect analytics collection.
          Restricting cookies may affect some website functionality or
          measurement.
        </p>
        <p>
          This website does not currently provide a dedicated cookie preference
          panel. Browser controls do not necessarily disable every form of data
          processing, so consult Google&apos;s guidance for additional information.
        </p>

        <h2>4. How Information Is Used</h2>
        <p>
          Analytics information is used to understand website traffic, identify
          popular content, measure visitor interactions, and improve the
          website. It is not intentionally used by this portfolio to sell
          visitors&apos; personal information.
        </p>

        <h2>5. External Websites</h2>
        <p>
          This portfolio may link to third-party websites, such as GitHub and
          LinkedIn. Those websites operate under their own privacy policies and
          practices.
        </p>

        <h2>6. Data Retention and Security</h2>
        <p>
          Analytics data retention is subject to the settings configured in
          Google Analytics and Google&apos;s retention practices. Reasonable measures
          are taken to maintain the website, but no internet transmission or
          storage system can be guaranteed to be completely secure.
        </p>

        <h2>7. Your Privacy Rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or object to certain processing of your personal information.
          Applicable rights depend on local law and the circumstances of the
          processing.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          This policy may be updated when the website&apos;s functionality or data
          practices change. The latest revision date will be shown at the top of
          this page.
        </p>

        <h2>9. Contact</h2>
        <p>
          For privacy-related questions, contact me through my{" "}
          <a
            href="https://www.linkedin.com/in/shamanth-krishna-v-r-89178b267/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn profile
          </a>
          .
        </p>
      </article>
    </main>
  );
}
