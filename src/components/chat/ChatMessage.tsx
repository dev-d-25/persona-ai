import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  // Normalize content: convert HTML <br> tags to newlines; keep other HTML disabled for safety
  const normalizedContent = React.useMemo(() => {
    return (content || "")
      .replace(/<br\s*\/>/gi, "\n")
      .replace(/<br\s*>/gi, "\n");
  }, [content]);

  // Code renderer for react-markdown (typed as any due to upstream type limitations)
  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    if (!inline) {
      const code = String(children).replace(/\n$/, "");
      const lineCount = code.split("\n").length;
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match?.[1] || "text"}
          PreTag="div"
          wrapLongLines
          showLineNumbers={lineCount > 1}
          customStyle={{
            margin: 0,
            borderRadius: 8,
            fontSize: "0.85rem",
            background: "#0b1020",
          }}
        >
          {code}
        </SyntaxHighlighter>
      );
    }
    return (
      <code className="rounded bg-gray-800/70 px-1.5 py-0.5 text-[0.9em] text-white" {...props}>
        {children}
      </code>
    );
  };

  return (
    <div
      className={`max-w-[80%] rounded-lg px-4 py-3 ${
        isUser
          ? "bg-white text-black ml-auto shadow-sm"
          : "text-white" // No background for assistant messages
      }`}
    >
      <div className="prose prose-sm prose-invert max-w-none prose-p:text-white prose-li:text-white prose-strong:text-white prose-em:text-white prose-pre:bg-[#0b1020] prose-pre:text-white">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            table: ({ children }) => (
              <table className="border-collapse border border-gray-600 w-full my-4">
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th className="border border-gray-600 px-4 py-2 bg-gray-700 text-white text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-600 px-4 py-2 text-white">
                {children}
              </td>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-gray-300">
                {children}
              </tr>
            ),
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
