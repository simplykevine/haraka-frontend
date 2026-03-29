'use client';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

type PrivacyPolicyModalProps = {
  open: boolean;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  onClose: () => void;
  onAgree: () => void;
};

export default function PrivacyPolicyModal({
  open,
  agreed,
  setAgreed,
  onClose,
  onAgree,
}: PrivacyPolicyModalProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  if (!open) return null;

  function handleAgree() {
    if (!agreed) {
      setLocalError('Please tick the checkbox to agree to the privacy policy.');
      return;
    }
    setLocalError(null);
    onAgree();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        background: 'rgba(16,32,66,0.75)',
      }}
    >
      <div className="bg-[#091227] border border-[#9FF8F8] rounded-lg shadow-2xl p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto relative">
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

        <h2 className="text-3xl text-center font-bold mb-4 text-[#9FF8F8]">
          Privacy Policy
        </h2>
        <p className="text-white/70 text-center text-sm mb-6">
          Effective date: <span className="text-[#9FF8F8] font-semibold">March 25, 2026</span>
        </p>

        <div className="bg-[#0B182F] border-l-4 border-[#9FF8F8] p-4 mb-6 rounded-r">
          <p className="text-white text-sm leading-relaxed">
            This Privacy Policy explains how Zeno collects, uses, stores, and protects information 
            when you use the platform. Zeno is a <span className="text-[#9FF8F8] font-semibold">decision-support system</span> intended 
            to help economists and policy analysts explore scenarios and produce structured outputs.
          </p>
        </div>

        <div className="space-y-5 text-white text-base">
          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">1. Information Zeno Collects</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno may collect the following categories of information:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-white/90 mt-2">
              <li><strong>Account information:</strong> Name, email address, and authentication identifiers</li>
              <li><strong>Usage information:</strong> Timestamps, run status events, and error logs</li>
              <li><strong>User-submitted content:</strong> Questions, prompts, and text for analysis</li>
              <li><strong>Feedback data:</strong> Survey responses or qualitative feedback (if participating in research)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">2. Why Zeno Collects This Information</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno collects and processes information to provide core platform functionality, improve 
              system reliability, support research evaluation, and maintain security.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">3. Use of AI Services</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno uses AI models (Google Gemini) to generate outputs that support analysis. These 
              outputs are intended for <span className="text-[#9FF8F8]">decision support</span> and should be reviewed by 
              qualified users. Zeno does not guarantee that outputs are complete, correct, or up to date.
            </p>
            <div className="mt-3 bg-[#0B182F] border-l-4 border-amber-500 p-3 rounded-r">
              <p className="text-amber-400 text-xs">
                <strong>Important:</strong> Outputs are advisory only. Human review is required for 
                high-stakes policy decisions.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">4. Third-Party Processing</h3>
            <p className="text-white/90 leading-relaxed">
              To generate responses, Zeno may send user-submitted prompts to third-party service 
              providers. Users should not submit confidential institutional documents or sensitive 
              personal data unless authorized.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">5. Data Minimization</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno is designed to collect only the information required to deliver its services. 
              Users are encouraged to avoid entering unnecessary personal information or confidential 
              documents.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">6. Data Storage and Retention</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno stores run history and outputs to support traceability and continuity. Access is 
              restricted to authenticated users. Data is retained for as long as necessary to support 
              platform use and evaluation, after which it should be deleted or anonymized.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">7. Sharing of Information</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno does not sell personal data. Information is shared only when necessary to operate 
              the service, comply with legal obligations, or support ethically approved research.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">8. Security Measures</h3>
            <p className="text-white/90 leading-relaxed">
              Zeno applies reasonable technical and organizational measures to protect information 
              from unauthorized access, alteration, or disclosure. However, no system can guarantee 
              absolute security.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">9. Your Rights and Choices</h3>
            <p className="text-white/90 leading-relaxed">
              Where applicable, users may request access to their stored data, correction of inaccurate 
              data, or deletion of their account and associated runs.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">10. Research and Ethics Compliance</h3>
            <p className="text-white/90 leading-relaxed">
              If you participate in user testing or evaluation, participation is voluntary and governed 
              by the relevant REC approval and informed consent process.
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-2 text-[#9FF8F8] font-semibold">11. Contact</h3>
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

         
        </div>

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
                I have read and agree to the Privacy Policy
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