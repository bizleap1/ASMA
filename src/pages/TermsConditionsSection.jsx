import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

const TermsConditionsSection = () => {
  return (
    <AnimatedSection className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="space-y-8 text-[#4A6356] font-['Inter'] font-normal leading-relaxed text-sm md:text-base">
          <p>
            Welcome to Advait Stock Market Academy (ASMA)!
          </p>
          <p>
            These terms and conditions outline the rules and regulations for the use of Advait Stock Market Academy's Website, located at https://www.asmaonline.in.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Advait Stock Market Academy if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Educational Disclaimer:</h2>
            <p>
              Advait Stock Market Academy is an educational and training institution. All training courses, webinars, market commentary, chart illustrations, and materials are strictly for educational and training purposes and must not be construed as investment or financial advice. Trading and investing in securities, commodities, and derivatives carry inherent financial risks.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Cookies:</h2>
            <p>
              The website uses cookies to help personalize your online experience. By accessing Advait Stock Market Academy, you agree to use the necessary cookies for security, navigation, and core functionality.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">License & Intellectual Property:</h2>
            <p>
              Unless otherwise stated, Advait Stock Market Academy and/or its licensors own the intellectual property rights for all material on Advait Stock Market Academy. All intellectual property rights are reserved. You may access this from Advait Stock Market Academy for your own personal educational use subjected to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="space-y-2 pl-2">
              {[
                "Copy, reproduce, or republish course modules or materials from Advait Stock Market Academy.",
                "Sell, rent, sub-license, or redistribute proprietary academy study material.",
                "Reproduce, duplicate, or mirror proprietary trading software configurations without prior written consent."
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063925]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#0B2117]/10">
            <h2 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">Reservation of Rights:</h2>
            <p>
              Advait Stock Market Academy reserves the right to request that you remove all links or any particular link to our Website. You agree to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default TermsConditionsSection;