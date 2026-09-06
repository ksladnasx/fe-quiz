import { memo, useCallback, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  // react-markdown 元素带有 children
  const el = node as { props?: { children?: ReactNode } }
  if (el.props?.children !== undefined) return extractText(el.props.children)
  return ''
}

function CodeBlockHead({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const done = () => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(done, () => done())
    } else {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      done()
    }
  }, [code])

  return (
    <div className="code-block-head">
      <span className="code-lang">{lang || 'text'}</span>
      <button type="button" className="copy-btn" onClick={handleCopy}>
        {copied ? '✓ 已复制' : '复制'}
      </button>
    </div>
  )
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          pre({ children }) {
            // 拿到内部 code 元素，提取语言与文本
            const codeEl = Array.isArray(children) ? children[0] : children
            const props = (codeEl as { props?: { className?: string; children?: ReactNode } })
              ?.props
            const className = props?.className ?? ''
            const match = /language-(\w+)/.exec(className)
            const raw = extractText(props?.children)
            return (
              <div className="code-block">
                <CodeBlockHead code={raw} lang={match?.[1] ?? ''} />
                <pre>{children}</pre>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export const Markdown = memo(MarkdownContent)
