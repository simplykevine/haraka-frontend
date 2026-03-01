import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AgentMessageProps {
  text?: string | null;
  loading?: boolean;
  progressMessages?: string[];
}

export default function AgentMessage({ text, loading, progressMessages = [] }: AgentMessageProps) {
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
        <div className="bg-[#131F36] text-white p-1 rounded-2xl rounded-bl-none max-w-[90%] ">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Connecting the dots across global markets...</span>
          </div>
          {progressMessages.map((msg, index) => (
            <div key={index} className="text-sm text-gray-300 mt-1 pl-7 animate-fadeIn">
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
      <div className="bg-[#131F36] text-white p-2 rounded-2xl rounded-bl-none max-w-[95%]">
        <div className="prose prose-invert prose-base max-w-none
          prose-headings:text-white-400 
          prose-headings:font-bold
          prose-headings:mt-4
          prose-headings:mb-2
          prose-h1:text-xl
          prose-h2:text-lg
          prose-h3:text-base
          prose-p:text-gray-200
          prose-p:leading-relaxed
          prose-p:mb-3
          prose-strong:text-white
          prose-strong:font-semibold
          prose-em:text-gray-300
          prose-ul:text-gray-200
          prose-ul:my-2
          prose-ul:pl-4
          prose-ol:text-gray-200
          prose-ol:my-2
          prose-ol:pl-4
          prose-li:my-1
          prose-li:leading-relaxed
          prose-blockquote:border-cyan-500
          prose-blockquote:text-gray-300
          prose-code:text-cyan-300
          prose-code:bg-gray-800
          prose-code:px-1
          prose-code:rounded
          prose-pre:bg-gray-800
          prose-pre:rounded-lg
          prose-hr:border-gray-600
          prose-table:text-sm
          prose-th:text-cyan-400
          prose-th:font-semibold
          prose-td:text-gray-200
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}