'use client';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

type TermsModalProps = {
  open: boolean;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  onClose: () => void;
  onAgree: () => void;
};

export default function TermsModal({
  open,
  agreed,
  setAgreed,
  onClose,
  onAgree,
}: TermsModalProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  if (!open) return null;

  function handleAgree() {
    if (!agreed) {
      setLocalError('Please tick the checkbox to agree to the terms and conditions.');
      return;
    }
    setLocalError(null);
    onAgree();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(16,32,66,0.75)',
      }}
    >
      <div className="bg-[#091227] border border-[#9FF8F8] rounded-lg shadow-2xl p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <div className="sticky top-0 z-10 flex justify-end">
          <button
            onClick={onClose}
            className="text-[#9FF8F8] hover:text-white"
            aria-label="Close"
            style={{ marginRight: '-1rem', marginTop: '-1rem' }}
          >
            <CloseIcon fontSize="large" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl text-center font-bold mb-4 text-[#9FF8F8]">
          Terms of Use (EULA)
        </h2>
        <p className="text-white/70 text-center text-sm mb-6">
          Effective date: <span className="text-[#9FF8F8] font-semibold">March 25, 2026</span>
        </p>

        {/* Introduction Box */}
        <div className="bg-[#0B182F] border-l-4 border-[#9FF8F8] p-4 mb-6 rounded-r">
          <p className="text-white text-sm leading-relaxed">
            These Terms of Use govern your access to and use of Zeno AI. By using the platform, 
            you agree to these terms. Zeno is a <span className="text-[#9FF8F8] font-semibold">decision-support tool</span>  intended 
            to assist economists and policy analysts with trade analysis, forecasting, and 
            scenario exploration. It does not replace professional judgment or official 
            policy processes.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-5 text-white text-base">
          {/* Section 1 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">1. Purpose of the Platform</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno is provided as a <span className="text-[#9FF8F8]">decision-support and research-oriented tool</span> 
              intended to assist analysis workflows. It does not replace professional judgment, 
              official policy processes, or expert review, and it should not be treated as an 
              official source of truth. All outputs should be validated by qualified users before 
              use in high-stakes settings.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">2. Acceptable Use</h3>
            <p className="text-white/90 leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc ml-6 space-y-1 text-white/90">
              <li>Use the platform for unlawful purposes</li>
              <li>Attempt to gain unauthorized access to accounts, data, or system infrastructure</li>
              <li>Upload malicious content or disrupt system operations</li>
              <li>Use the platform to produce or spread deceptive content presented as verified fact</li>
              <li>Reverse engineer, decompile, or attempt to extract source code from the platform</li>
              <li>Share your account credentials with unauthorized third parties</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">3. User Responsibility & Appropriate Reliance</h3>
            <p className="text-white/90 leading-relaxed">
              You are responsible for how you interpret and use Zeno's outputs. Outputs should be 
              treated as <span className="text-[#9FF8F8]">advisory</span> and may contain errors. Users must validate 
              critical information before using it in high-stakes settings, including policy 
              recommendations, trade negotiations, or public communications. The platform is 
              designed to support human decision-making, not replace it.
            </p>
            <div className="mt-3 bg-[#0B182F] border-l-4 border-amber-500 p-3 rounded-r">
              <p className="text-amber-400 text-xs">
                <strong>Important:</strong> Final policy decisions must always include human 
                expert review and validation.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">4. Content You Submit</h3>
            <p className="text-white/90 leading-relaxed mb-2">
              You retain responsibility for the content you submit. You should not submit 
              confidential materials unless you have the right and authorization to do so.
            </p>
            <p className="text-white/90 leading-relaxed">
              By using the platform, you grant Zeno permission to process your submitted content 
              to generate outputs and to store run history for traceability and continuity. 
              Stored runs may be reviewed for quality improvement and research purposes under 
              ethical approval guidelines.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">5. Limitations of Liability</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno is provided <span className="text-[#9FF8F8]">"as is"</span> for research and decision-support purposes. 
              To the maximum extent permitted by law, the project team is not liable for losses 
              arising from reliance on generated outputs, system downtime, data inaccuracies, or 
              any consequential damages. Users assume all risk associated with their use of the 
              platform and its outputs.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">6. Intellectual Property</h3>
            <p className="text-white/90 leading-relaxed">
              Unless otherwise stated, the Zeno system, its design, and its code are owned by 
              the project author or relevant rights holders. You may not copy, redistribute, 
              resell, or create derivative works from the platform without explicit written 
              permission. All trademarks, logos, and brand names are the property of their 
              respective owners.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">7. Termination</h3>
            <p className="text-white/90 leading-relaxed">
              Access may be suspended or terminated if misuse is detected or if continued access 
              poses a security or ethical risk. Users will be notified of termination where 
              reasonably practicable. Upon termination, your right to use the platform ceases 
              immediately, but stored runs may be retained for audit and research purposes 
              under ethical guidelines.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">8. Changes to These Terms</h3>
            <p className="text-white/90 leading-relaxed">
              Terms may be updated to reflect improvements, legal requirements, or governance 
              updates. Users will be notified of material changes via email or platform notice 
              where feasible. Continued use after changes means you accept the updated terms. 
              We encourage users to review these terms periodically.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">9. Contact</h3>
            <p className="text-white/90 leading-relaxed mb-2">
              For questions about these terms, privacy practices, or ethical concerns, contact:
            </p>
            <div className="bg-[#0B182F] rounded p-3">
              <p className="text-white/90">
                <strong className="text-[#9FF8F8]">Email:</strong>{' '}
                <a href="mailto:zenoaiagent@gmail.com" className="text-[#9FF8F8] hover:underline">
                  zenoaiagent@gmail.com
                </a>
              </p>
              <p className="text-white/90 mt-2">
                <strong className="text-[#9FF8F8]">Project:</strong> Zeno AI - Agricultural Trade Policy Decision-Support
              </p>
              <p className="text-white/90 mt-2">
                <strong className="text-[#9FF8F8]">Institution:</strong> African Leadership University, Rwanda
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#0B182F] border border-white/20 rounded p-4 mt-4">
            <p className="text-white/60 text-xs">
              <strong>Disclaimer:</strong> This is a draft document for academic compliance purposes. 
              It is provided to show compliance with ethical requirements, but should be reviewed 
              and approved by a legal professional before production use.
            </p>
          </div>
        </div>

        {/* Agreement Checkbox & Button */}
        <div className="flex flex-col mt-6">
          <div className="flex items-center justify-between gap-4 w-full">
            <label className="flex items-center gap-2 select-none group w-full">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => {
                  setAgreed(!agreed);
                  setLocalError(null);
                }}
                className="accent-[#9FF8F8] h-5 w-5 cursor-pointer"
              />
              <span className="text-white text-base group-hover:underline cursor-pointer">
                Agree to terms and conditions
              </span>
            </label>
            <button
              className="bg-[#9FF8F8] text-[#0B182F] px-6 py-1 rounded-[10px] text-lg shadow transition-all hover:bg-cyan-100 cursor-pointer"
              onClick={handleAgree}
            >
              Agree
            </button>
          </div>

          {localError && (
            <div className="w-full text-red-400 text-center text-sm mt-2 mb-2 hover:underline">
              {localError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}