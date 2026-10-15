import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

const PrivacyPolicySection = () => {
  return (
    <AnimatedSection className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="space-y-8 text-[#4A6356] font-['Inter'] font-normal leading-relaxed text-sm md:text-base">
          <p>
            Advait Stock Market Academy website is owned by Advait Stock Market Academy, which is a data controller of your personal data.
          </p>
          <p>
            We have adopted this Privacy Policy, which determines how we are processing the information collected by Advait Stock Market Academy, which also provides the reasons why we must collect certain personal data about you. Therefore, you must read this Privacy Policy before using Advait Stock Market Academy website.
          </p>
          <p>
            We take care of your personal data and undertake to guarantee its confidentiality and security.
          </p>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Personal information we collect:</h2>
            <p>
              When you visit the Advait Stock Market Academy, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the installed cookies on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products you view, what websites or search terms referred you to the Site, and how you interact with the Site. We refer to this automatically-collected information as "Device Information." Moreover, we might collect the personal data you provide to us (including but not limited to Name, Surname, Address, payment information, etc.) during registration to be able to fulfill the agreement.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Why do we process your data?</h2>
            <p>
              Our top priority is customer data security, and, as such, we may process only minimal user data, only as much as it is absolutely necessary to maintain the website. Information collected automatically is used only to identify potential cases of abuse and establish statistical information regarding website usage. This statistical information is not otherwise aggregated in such a way that it would identify any particular user of the system.
            </p>
            <p>
              You can visit the website without telling us who you are or revealing any information, by which someone could identify you as a specific, identifiable individual. If, however, you wish to use some of the website's features, or you wish to receive our newsletter or provide other details by filling a form, you may provide personal data to us, such as your email, first name, last name, city of residence, organization, telephone number. You can choose not to provide us with your personal data, but then you may not be able to take advantage of some of the website's features.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Your rights:</h2>
            <p>If you have questions regarding your personal data rights, you have the following:</p>
            <ul className="space-y-2 pl-2">
              {[
                "The right to be informed.",
                "The right of access.",
                "The right to rectification.",
                "The right to erasure.",
                "The right to restrict processing.",
                "The right to data portability.",
                "The right to object."
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063925]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              If you would like to exercise this right, please contact us through our Nagpur admissions desk.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Links to other websites:</h2>
            <p>
              Our website may contain links to other websites that are not owned or controlled by us. Please be aware that we are not responsible for such other websites or third parties' privacy practices. We encourage you to be aware when you leave our website and read the privacy statements of each website that may collect personal information.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Information security:</h2>
            <p>
              We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We keep reasonable administrative, technical, and physical safeguards to protect against unauthorized access, use, modification, and personal data disclosure in its control and custody.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Legal disclosure:</h2>
            <p>
              We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PrivacyPolicySection;