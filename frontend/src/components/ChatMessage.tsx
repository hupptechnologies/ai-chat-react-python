import React, { useState, useMemo, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatMessageDateTime, autoLinkUrls } from '../utils/common';
import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

interface CodeBlockWithCopyProps {
  codeString: string;
  language?: string;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlockWithCopy = memo(({ codeString, language, ...props }: CodeBlockWithCopyProps) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopy}
        className="message-copy-button"
        title={copied ? 'Copied!' : 'Copy code'}
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter style={oneDark} language={language} PreTag="div" {...props}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
});

const MessageAvatar = memo(({ isUser }: { isUser: boolean }) => (
  <div className="avatar-container">
    <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
      <span className="avatar-text">{isUser ? 'U' : 'AI'}</span>
    </div>
  </div>
));

const MessageMeta = memo(
  ({ formattedDateTime, isStreaming }: { formattedDateTime: string; isStreaming: boolean }) => (
    <div className="message-meta">
      <span className="message-time">{formattedDateTime}</span>
      {isStreaming && <span className="streaming-text">Typing...</span>}
    </div>
  )
);

const MessageBody = memo(
  ({ message, formattedDateTime }: { message: Message; formattedDateTime: string }) => {
    const isUser = message.role === 'user';
    const isStreaming = message.isStreaming;
    const markdownComponents = useMemo(
      () => ({
        a({
          href,
          children,
          ...props
        }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          );
        },
        code({
          className,
          children,
          inline,
          ...props
        }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; children?: React.ReactNode }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          const isCommand =
            !inline &&
            (codeString.trim().startsWith('$') ||
              /^(cd|ls|npm|yarn|pnpm|git|python|pip|bash|sh|cat|echo|sudo|apt|curl|wget|docker|npx|node|rm|cp|mv|touch|mkdir|rmdir|chmod|chown|ps|kill|service|systemctl|ifconfig|ping|ssh|scp|tar|zip|unzip|find|grep|awk|sed|top|htop|du|df|whoami|passwd|adduser|useradd|usermod|deluser|userdel|passwd|su|logout|reboot|shutdown|mount|umount|journalctl|dmesg|env|export|alias|unalias|history|clear|reset|screen|tmux|nano|vim|vi|emacs|less|more|head|tail|man|which|whereis|locate|date|cal|bc|expr|seq|yes|true|false|sleep|time|watch|at|cron|crontab|jobs|bg|fg|disown|wait|trap|ulimit|set|unset|type|hash|help|source|docker|doc)\b/.test(
                codeString.trim()
              ));
          const language = match ? match[1] : isCommand ? 'bash' : undefined;
          return !inline && (match || isCommand) ? (
            <CodeBlockWithCopy codeString={codeString} language={language} {...props} />
          ) : (
            <code className={className}>{children}</code>
          );
        },
      }),
      []
    );

    return (
      <div className="message-body">
        <div className="message-author">{isUser ? 'You' : 'AI Assistant'}</div>
        <div className="message-text">
          <ReactMarkdown components={markdownComponents}>
            {autoLinkUrls(message.content)}
          </ReactMarkdown>
          {isStreaming && <span className="streaming-indicator" />}
        </div>
        <MessageMeta formattedDateTime={formattedDateTime} isStreaming={!!isStreaming} />
      </div>
    );
  }
);

export const ChatMessage: React.FC<ChatMessageProps> = memo(({ message }) => {
  const isUser = message.role === 'user';
  const formattedDateTime = useMemo(
    () => formatMessageDateTime(message.created_at),
    [message.created_at]
  );

  return (
    <div className={`message-wrapper ${isUser ? 'message-user' : 'message-ai'}`}>
      <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'} message-content`}>
        <div className="message-layout">
          {!isUser && <MessageAvatar isUser={false} />}
          <MessageBody message={message} formattedDateTime={formattedDateTime} />
          {isUser && <MessageAvatar isUser={true} />}
        </div>
      </div>
    </div>
  );
});
