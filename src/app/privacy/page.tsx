import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the Shamanth Krishna V R portfolio website, including Google Analytics, Microsoft Clarity, and visitor privacy.",
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
          website collects and uses information when you visit{" "}
          <a href="https://shamanth-k.github.io/">
            https://shamanth-k.github.io/
          </a>
          .
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          This website does not ask visitors to create an account. When you
          visit, technical and usage information may be processed, including
          browser and device information, pages viewed, approximate location
          derived from an IP address, traffic sources, and interactions with
          website content. The information collected depends on the analytics
          services and their configuration.
        </p>

        <h2>2. Google Analytics</h2>
        <p>
          This website uses Google Analytics 4 to understand website traffic and
          improve the visitor experience. Depending on its configuration, Google
          Analytics may use cookies or similar technologies to collect
          information about visits, page views, interactions, browser and device
          information, and traffic sources.
        </p>
        <p>
          Google processes data in accordance with its own policies. For more
          information, read the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
          .
        </p>

        <h2>3. Microsoft Clarity</h2>
        <p>
          This website uses Microsoft Clarity to understand how visitors
          interact with the website and to improve usability. Clarity may
          collect interaction and technical information, such as clicks,
          scrolling, mouse movements, page interactions, and information about
          how pages are displayed. It can use this information to generate
          heatmaps and session recordings.
        </p>
        <p>
          Clarity may use cookies and similar technologies to support analytics
          and associate activity with a browsing session. The data collected
          depends on the service configuration and applicable privacy settings.
          For more information, read the{" "}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Privacy Statement
          </a>{" "}
          and the{" "}
          <a
            href="https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Clarity cookie documentation
          </a>
          .
        </p>

        <h2>4. Cookies, Tracking, and Consent</h2>
        <p>
          Google Analytics and Microsoft Clarity may use cookies or similar
          technologies. Browser settings, privacy controls, and content blockers
          may affect analytics collection, but they may not prevent every form
          of data processing.
        </p>
        <p>
          This website does not currently provide a dedicated cookie preference
          panel. Analytics scripts may initialize when the website loads. Where
          consent is required by applicable law or by a service&apos;s consent
          requirements, appropriate consent controls must be configured. Please
          do not assume that changing browser settings alone disables all
          analytics processing.
        </p>

        <h2>5. How Information Is Used</h2>
        <p>
          Analytics information is used to understand website traffic, identify
          popular content, review interactions, diagnose usability issues, and
          improve the website. This portfolio is not intended to sell
          visitors&apos; personal information.
        </p>

        <h2>6. Third-Party Services and External Websites</h2>
        <p>
          Analytics providers process information according to their own
          policies and service terms. This portfolio may also link to
          third-party websites, such as GitHub and LinkedIn. Those websites
          operate under their own privacy policies and practices.
        </p>

        <h2>7. Data Retention and Security</h2>
        <p>
          Analytics data retention depends on the settings configured with each
          provider and its applicable retention practices. Reasonable measures
          are taken to maintain the website, but no internet transmission or
          storage system can be guaranteed to be completely secure.
        </p>

        <h2>8. Your Privacy Rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or object to certain processing of your personal information,
          or to withdraw consent where applicable. These rights depend on local
          law and the circumstances of the processing. You can also consult the
          privacy resources provided by Google and Microsoft.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          This policy may be updated when the website&apos;s functionality or
          data practices change. The latest revision date will be shown at the
          top of this page.
        </p>

        <h2>10. Contact</h2>
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
