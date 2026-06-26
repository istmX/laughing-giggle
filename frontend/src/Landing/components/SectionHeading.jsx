const SectionHeading = ({
  eyebrow,
  title,
  description,
  className = '',
  dark = false,
}) => {
  return (
    <div className={`max-w-2xl space-y-4 ${className}`}>
      <p
        className={`text-xs uppercase tracking-[0.32em] ${
          dark ? 'text-white/60' : 'text-muted-foreground'
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="text-[clamp(2.4rem,4.1vw,4.25rem)] font-medium leading-[0.94] tracking-[-0.06em] text-balance text-inherit">
        {title}
      </h2>
      {description ? (
        <p
          className={`max-w-xl text-[1.05rem] leading-8 ${
            dark ? 'text-white/72' : 'text-muted-foreground'
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default SectionHeading
