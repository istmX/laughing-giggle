import React, { useState } from 'react'
import { FileText, Copy, Check, X, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const DesignDocDrawer = ({ isOpen, onClose, designDoc, sessionTitle }) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    if (!designDoc) return
    navigator.clipboard.writeText(designDoc)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!designDoc) return
    const blob = new Blob([designDoc], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${(sessionTitle || 'DESIGN').replace(/\s+/g, '_')}_DESIGN.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-full bg-surface border-l border-hairline flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-hairline flex items-center justify-between shrink-0 bg-canvas">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-indigo/10 text-brand-indigo rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-tight">DESIGN.md Specification</h3>
              <p className="text-xs text-ink-muted">AI-Ready Context File for Coding Agents</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-hairline rounded-md text-xs font-medium hover:bg-canvas transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy DESIGN.md'}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-canvas rounded-md text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download .md
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-canvas rounded-md transition-colors cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Markdown Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-canvas text-ink text-sm leading-relaxed">
          {designDoc ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {designDoc}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-2">
              <FileText className="w-8 h-8 text-ink-muted" />
              <p className="text-xs font-mono">No DESIGN.md generated yet. Send a prompt to generate design tokens & spec.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
