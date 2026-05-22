import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <main className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Badge variant="outline" className="mb-6">Legal</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">Last updated: December 30, 2025</p>

          <p>
            Welcome to WebForYou. By accessing or using our website and services, you agree to comply with and be bound by the following Terms & Conditions.<br></br>
            Note: WEBFORYOU IS NOT A  REGISTERED AGENCY .<div>Please read the terms  carefully.</div> 
          </p>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By using this website or engaging with our services, you confirm that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, please do not use our website or services.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>WebForYou provides website design, development, UI/UX, SEO, maintenance, and AI-integrated digital solutions.</li>
              <li>The scope, pricing, timeline, and deliverables for each project are defined based on the selected plan or mutually agreed proposal.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Pricing & Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices listed on the website are indicative and may vary based on project requirements.</li>
              <li>Payments must be made as agreed before or during the project timeline.</li>
              <li>Any third-party costs (hosting, domains, APIs, AI tools, etc.) are not included unless explicitly stated.</li>
              <li>Monthly or recurring charges (such as AI API costs) are the client’s responsibility.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Project Timeline & Revisions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Project timelines depend on the scope, client responsiveness, and timely sharing of required content.</li>
              <li>Revisions are limited to what is mentioned in the selected plan or proposal.</li>
              <li>Additional changes or features may incur extra charges.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Client Responsibilities</h2>
            <p className="mb-4">Clients agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information, content, and feedback on time</li>
              <li>Ensure they have rights to any content (text, images, logos) shared with WebForYou</li>
              <li>Review and approve work within reasonable timelines</li>
            </ul>
            <p className="mt-4 italic">Delays from the client side may impact project delivery dates.</p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upon full payment, ownership of the final website design and code (excluding third-party tools and libraries) is transferred to the client.</li>
              <li>WebForYou reserves the right to showcase completed projects in its portfolio unless otherwise agreed in writing.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Services</h2>
            <p className="mb-4">WebForYou may integrate third-party tools, platforms, or APIs. We are not responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Downtime or failures of third-party services</li>
              <li>Changes in pricing or policies of third-party providers</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">WebForYou is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Business losses, revenue loss, or indirect damages</li>
              <li>Website downtime caused by hosting providers, third-party services, or misuse</li>
              <li>Issues arising after project handover due to unauthorized modifications</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Termination</h2>
            <p className="mb-4">WebForYou reserves the right to terminate services if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments are not made as agreed</li>
              <li>There is misuse of services or abusive behavior</li>
              <li>The client violates these Terms</li>
            </ul>
            <p className="mt-4">In such cases, no refunds will be issued for completed or ongoing work.</p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Refund Policy</h2>
            <p className="mb-4">Due to the custom nature of our services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments are non-refundable once the project has started</li>
              <li>Refunds, if any, are solely at the discretion of WebForYou and only under exceptional circumstances</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential information, business data, and project details private unless required by law.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to Terms</h2>
            <p>
              WebForYou reserves the right to update or modify these Terms & Conditions at any time. Continued use of the website or services indicates acceptance of the updated terms.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">13. Governing Law</h2>
            <p>
              These Terms & Conditions are governed by and interpreted in accordance with the laws of India.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">14. Contact Information</h2>
            <p className="mb-4">For any questions regarding these Terms & Conditions, please contact at:</p>
            <p className="font-bold text-foreground"><a href=" https://www.wfy.co.in/contact">CLICK HERE TO  CONTACT US!</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
