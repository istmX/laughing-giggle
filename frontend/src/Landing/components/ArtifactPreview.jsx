import { ArrowRight } from 'lucide-react'

const ArtifactPreview = ({
  title,
  label,
  summary,
  accent = 'bg-doc-blue',
  lines = [],
  tone = 'light',
  className = '',
  children,
}) => {
  const dark = tone === 'dark'

  return (
    <article
      className={[
        'overflow-hidden rounded-[18px] border text-left shadow-[0_18px_50px_rgba(0,0,0,0.08)]',
        dark
          ? 'border-white/10 bg-[#121826] text-white'
          : 'border-border bg-white text-black',
        className,
      ].join(' ')}
    >
      <div className={`h-1.5 ${accent}`} />
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p
            className={`text-[0.65rem] uppercase tracking-[0.28em] ${
              dark ? 'text-white/55' : 'text-muted-foreground'
            }`}
          >
            {label}
          </p>
          <h3 className="text-lg font-semibold tracking-[-0.04em]">{title}</h3>
          {summary ? (
            <p className={`text-sm leading-6 ${dark ? 'text-white/70' : 'text-muted-foreground'}`}>
              {summary}
            </p>
          ) : null}
        </div>

        {children ? (
          <div>{children}</div>
        ) : (
          <ul className="space-y-2 text-sm">
            {lines.map((line) => (
              <li key={line} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${accent}`} />
                <span className={dark ? 'text-white/70' : 'text-black/70'}>{line}</span>
              </li>
            ))}
          </ul>
        )}

        <div
          className={`flex items-center gap-2 text-xs uppercase tracking-[0.24em] ${
            dark ? 'text-white/55' : 'text-muted-foreground'
          }`}
        >
          <span>Preview</span>
          <ArrowRight className="size-3.5" />
        </div>
      </div>
    </article>
  )
}

export default ArtifactPreview
