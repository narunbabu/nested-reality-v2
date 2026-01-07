export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      <header className="space-y-4 border-b border-stone-200 pb-12">
        <h1 className="text-5xl font-serif text-stone-900">Privacy Policy</h1>
        <p className="text-xl text-stone-500 font-serif italic">Respecting the boundaries of the digital plenum.</p>
        <p className="text-sm text-stone-400">Last Updated: January 7, 2026</p>
      </header>

      <div className="prose prose-stone max-w-none space-y-16">

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Introduction</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              Nested Reality (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website <strong>nestedreality.org</strong> and <strong>ameyem.com</strong>. This Privacy Policy explains how we collect, use, protect, and share information when you visit our website or interact with our services.
            </p>
            <p>
              We are committed to protecting your privacy and collecting only the minimum information necessary to provide our services. We do not sell or share your personal data with third parties for marketing purposes.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Information We Collect</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <h3 className="text-base font-semibold text-stone-900">Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> When you create a reader account, we collect your email address and chosen username.</li>
              <li><strong>Reading Progress:</strong> If you use our reading tracker, we store your progress data to help you track your journey through the book.</li>
              <li><strong>Contact Information:</strong> When you contact us, we collect your name and email address.</li>
              <li><strong>Discussion Contributions:</strong> Any discussions, comments, or questions you post on our platform.</li>
            </ul>

            <h3 className="text-base font-semibold text-stone-900 mt-6">Information Automatically Collected</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> We collect information about how you interact with our website, including pages viewed, time spent, and navigation patterns.</li>
              <li><strong>Device Information:</strong> We collect device type, operating system, browser type, and IP address.</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use essential cookies to maintain your session and functional cookies for website operation.</li>
            </ul>

            <h3 className="text-base font-semibold text-stone-900 mt-6">AI Assistant Interactions</h3>
            <p>
              When you use our AI-powered concept explorer, we process your questions through the Google Gemini API. We do not store the content of your questions or the AI&apos;s responses beyond the current session.
            </p>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">How We Use Your Information</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our website and services</li>
              <li><strong>Authentication:</strong> To verify your identity and maintain secure access to your account</li>
              <li><strong>Reading Progress:</strong> To save and display your reading progress across sessions</li>
              <li><strong>Communication:</strong> To respond to your inquiries and send important service-related notifications</li>
              <li><strong>Analytics:</strong> To understand how our website is used and improve user experience</li>
              <li><strong>Advertising:</strong> To promote our book and educational content through Google Ads and other platforms</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </div>
        </section>

        {/* Data Sharing and Third Parties */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Data Sharing and Third-Party Services</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>We use the following trusted third-party services to operate our website:</p>

            <h3 className="text-base font-semibold text-stone-900">Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> For authentication, database hosting, and user data storage. Supabase complies with GDPR and industry-standard security practices.</li>
              <li><strong>Google Gemini API:</strong> For AI-powered concept exploration. Your questions are processed but not stored.</li>
              <li><strong>Google Ads:</strong> For advertising our content. Google may use cookies and tracking technologies as described in their privacy policy.</li>
              <li><strong>Amazon:</strong> Book purchases are completed through Amazon. We direct you to Amazon but do not collect payment information ourselves.</li>
            </ul>

            <h3 className="text-base font-semibold text-stone-900 mt-6">Data Protection</h3>
            <p>
              <strong>We do not sell your personal information to third parties.</strong> We only share data with service providers necessary to operate our website, and we require them to protect your data and use it only for the purposes we specify.
            </p>

            <h3 className="text-base font-semibold text-stone-900 mt-6">Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Cookies and Tracking Technologies</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <h3 className="text-base font-semibold text-stone-900">Essential Cookies</h3>
            <p>
              We use essential cookies to maintain your session, remember your login status, and ensure website functionality. These cookies are necessary for the website to work properly.
            </p>

            <h3 className="text-base font-semibold text-stone-900 mt-6">Analytics and Advertising Cookies</h3>
            <p>
              We may use analytics cookies to understand how visitors interact with our website. Google Ads may use cookies to measure advertising effectiveness and show you relevant ads.
            </p>

            <h3 className="text-base font-semibold text-stone-900 mt-6">Your Cookie Choices</h3>
            <p>
              Most browsers allow you to control cookies through their settings. However, disabling essential cookies may limit your ability to use certain features of our website.
            </p>
          </div>
        </section>

        {/* User Rights */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Your Rights and Choices</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> You can request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> You can update or correct your account information at any time</li>
              <li><strong>Deletion:</strong> You can request deletion of your account and associated data</li>
              <li><strong>Data Portability:</strong> You can request your data in a portable format</li>
              <li><strong>Opt-Out:</strong> You can opt out of marketing communications</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at <strong>arun@ameyem.com</strong>
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Data Security</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted data transmission using HTTPS/SSL</li>
              <li>Secure authentication through Supabase</li>
              <li>Regular security updates and monitoring</li>
              <li>Access controls and minimal data collection practices</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Data Retention</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              We retain your personal information only for as long as necessary to provide our services and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Data:</strong> Retained until you request deletion or close your account</li>
              <li><strong>Reading Progress:</strong> Retained while your account is active</li>
              <li><strong>Usage Data:</strong> Typically retained for 12-24 months for analytics purposes</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal obligations</li>
            </ul>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Children&apos;s Privacy</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately so we can delete it.
            </p>
          </div>
        </section>

        {/* International Users */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">International Users</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              Our services are operated from India. If you access our website from other countries, your information may be transferred to, stored, and processed in India or other countries where our service providers operate. By using our services, you consent to this transfer.
            </p>
            <p>
              We comply with applicable data protection laws, including GDPR for European users.
            </p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Changes to This Privacy Policy</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make significant changes, we will update the &quot;Last Updated&quot; date at the top of this page and may notify you through email or a notice on our website.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Contact Us</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-2">
              <p><strong>Ameyem Geosolutions</strong></p>
              <p>Arun Babu Nalamara</p>
              <p>Plot 49, Road No. 5, Satyasagar Colony</p>
              <p>Vanasthalipuram, Hyderabad 500070</p>
              <p>India</p>
              <p className="mt-4"><strong>Email:</strong> arun@ameyem.com</p>
              <p><strong>Website:</strong> nestedreality.org</p>
            </div>
          </div>
        </section>

        {/* Google Ads Specific */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Google Ads and Third-Party Advertising</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p>
              We use Google Ads to promote our educational content and book. Google may use cookies and tracking technologies to measure advertising effectiveness and personalize ads.
            </p>
            <p>
              You can opt out of personalized advertising by visiting Google&apos;s Ads Settings at <a href="https://www.google.com/settings/ads" className="text-blue-600 underline hover:text-blue-800">google.com/settings/ads</a> or by visiting <a href="http://www.aboutads.info" className="text-blue-600 underline hover:text-blue-800">www.aboutads.info</a>.
            </p>
            <p>
              For more information about how Google uses data, please review Google&apos;s Privacy Policy at <a href="https://policies.google.com/privacy" className="text-blue-600 underline hover:text-blue-800">policies.google.com/privacy</a>.
            </p>
          </div>
        </section>

        {/* Commitment */}
        <section className="space-y-4 border-t border-stone-200 pt-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Our Commitment</h2>
          <div className="text-lg text-stone-700 leading-relaxed font-light space-y-4">
            <p className="text-xl italic text-stone-600">
              Like the plenum we describe in our work—where density concentrates only where needed—we collect only the data necessary to serve you. Your privacy is not traded; it is protected.
            </p>
          </div>
        </section>

      </div>

      <footer className="pt-24 border-t border-stone-200">
        <a href="/" className="text-stone-900 font-bold text-sm hover:underline">&larr; Return to Central Hub</a>
      </footer>
    </div>
  );
}
