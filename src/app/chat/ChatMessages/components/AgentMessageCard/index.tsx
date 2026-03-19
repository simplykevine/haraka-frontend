'use client';
import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useThemeSafe } from '@/app/context/ThemeContext';

interface AgentMessageProps {
  text?: string | null;
  loading?: boolean;
  progressMessages?: string[];
}

export default function AgentMessage({ text, loading, progressMessages = [] }: AgentMessageProps) {
  const { theme } = useThemeSafe();

  const containerBg = theme === 'light' ? 'bg-blue-100' : 'bg-[#131F36]';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const spinnerBorder = theme === 'light' ? 'border-blue-500' : 'border-cyan-400';
  const loadingText = theme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const progressText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  
  const proseHeadingColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const proseParaColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const proseStrongColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const proseEmColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const proseListColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const proseBlockquoteBorder = theme === 'light' ? 'border-blue-400' : 'border-cyan-500';
  const proseBlockquoteText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const proseCodeText = theme === 'light' ? 'text-blue-600' : 'text-cyan-300';
  const proseCodeBg = theme === 'light' ? 'bg-blue-50' : 'bg-gray-800';
  const prosePreBg = theme === 'light' ? 'bg-blue-50' : 'bg-gray-800';
  const proseTableBorder = theme === 'light' ? 'border-blue-200' : 'border-gray-600';
  const proseThText = theme === 'light' ? 'text-blue-600' : 'text-cyan-400';
  const proseTdText = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const proseHrBorder = theme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const linkColor = theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-cyan-400 hover:text-cyan-300';

  if (loading || progressMessages.length > 0) {
    return (
      <div className="flex flex-col items-start">
        <div className="mb-1">
          <Image
            src="/images/zeno-logo-icon.png"
            alt="Zeno AI Logo"
            width={24}
            height={24}
          />
        </div>
        <div className={`${containerBg} ${textColor} p-1 rounded-2xl rounded-bl-none max-w-[90%] transition-colors`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-5 h-5 border-2 ${spinnerBorder} border-t-transparent rounded-full animate-spin`}></div>
            <span className={`${loadingText} transition-colors`}>Connecting the dots across global markets...</span>
          </div>
          {progressMessages.map((msg, index) => (
            <div key={index} className={`text-sm ${progressText} mt-1 pl-7 animate-fadeIn transition-colors`}>
              • {msg}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="flex flex-col items-start">
      <div className="mb-1">
        <Image
          src="/images/zeno-logo-icon.png"
          alt="Zeno AI Logo"
          width={24}
          height={24}
        />
      </div>
      <div className={`${containerBg} ${textColor} p-2 rounded-2xl rounded-bl-none max-w-[95%] transition-colors`}>
        <div className={`prose ${theme === 'light' ? 'prose' : 'prose-invert'} prose-base max-w-none transition-colors`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => (
                <h1 className={`${proseHeadingColor} text-xl font-bold mt-4 mb-2`} {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className={`${proseHeadingColor} text-lg font-bold mt-4 mb-2`} {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className={`${proseHeadingColor} text-base font-bold mt-4 mb-2`} {...props} />
              ),
              h4: ({ ...props }) => (
                <h4 className={`${proseHeadingColor} text-sm font-bold mt-3 mb-2`} {...props} />
              ),
              h5: ({ ...props }) => (
                <h5 className={`${proseHeadingColor} text-sm font-bold mt-3 mb-2`} {...props} />
              ),
              h6: ({ ...props }) => (
                <h6 className={`${proseHeadingColor} text-sm font-bold mt-3 mb-2`} {...props} />
              ),
              p: ({ ...props }) => (
                <p className={`${proseParaColor} leading-relaxed mb-3`} {...props} />
              ),
              strong: ({ ...props }) => (
                <strong className={`${proseStrongColor} font-semibold`} {...props} />
              ),
              em: ({ ...props }) => (
                <em className={`${proseEmColor} italic`} {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className={`${proseListColor} my-2 pl-4 list-disc`} {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className={`${proseListColor} my-2 pl-4 list-decimal`} {...props} />
              ),
              li: ({ ...props }) => (
                <li className={`${proseListColor} my-1 leading-relaxed`} {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className={`border-l-4 ${proseBlockquoteBorder} ${proseBlockquoteText} pl-4 italic my-2`}
                  {...props}
                />
              ),
              code: ({ ...props }: any) => (
                <code
                  className={`${proseCodeText} ${proseCodeBg} px-1 py-0.5 rounded text-sm font-mono inline-block`}
                  {...props}
                />
              ),
              pre: ({ ...props }) => (
                <pre
                  className={`${prosePreBg} rounded-lg p-3 overflow-x-auto my-2 border ${proseTableBorder}`}
                  {...props}
                />
              ),
              table: ({ ...props }) => (
                <div className="overflow-x-auto my-2">
                  <table
                    className={`w-full border-collapse border ${proseTableBorder}`}
                    {...props}
                  />
                </div>
              ),
              thead: ({ ...props }) => (
                <thead className={theme === 'light' ? 'bg-blue-50' : 'bg-gray-700'} {...props} />
              ),
              tbody: ({ ...props }) => (
                <tbody className={theme === 'light' ? 'bg-white' : 'bg-[#131F36]'} {...props} />
              ),
              th: ({ ...props }) => (
                <th
                  className={`${proseThText} font-semibold px-3 py-2 text-left border ${proseTableBorder}`}
                  {...props}
                />
              ),
              tr: ({ ...props }) => (
                <tr className={`border-b ${proseTableBorder}`} {...props} />
              ),
              td: ({ ...props }) => (
                <td
                  className={`${proseTdText} px-3 py-2 border ${proseTableBorder}`}
                  {...props}
                />
              ),
              hr: ({ ...props }) => (
                <hr className={`border-t-2 ${proseHrBorder} my-4`} {...props} />
              ),
              a: ({ ...props }) => (
                <a
                  className={`${linkColor} underline`}
                  {...props}
                />
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}