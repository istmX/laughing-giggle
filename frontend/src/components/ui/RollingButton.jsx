import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function RollingText({ text }) {
  if (!text) return null;
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative overflow-hidden h-[1.5em] flex items-center justify-center whitespace-pre"
    >
      <div className="flex">
        {text.split("").map((char, i) => (
          <motion.span
            key={`top-${i}`}
            variants={{
              rest: { y: 0 },
              hover: { y: "-150%" },
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
            className="block"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {text.split("").map((char, i) => (
          <motion.span
            key={`bottom-${i}`}
            variants={{
              rest: { y: "150%" },
              hover: { y: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
            className="block"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export function RollingButton({ href, onClick, text, className, children, ...props }) {
  const content = text || children;
  const baseClasses = `inline-flex h-11 items-center justify-center rounded-full px-6 font-sans text-sm font-[var(--font-weight-480)] transition-transform active:scale-95 cursor-pointer select-none`;

  const btnContent = typeof content === "string" ? <RollingText text={content} /> : content;

  if (href) {
    const isExternalOrHash = href.startsWith("http") || href.startsWith("#") || href.includes(":") || href.startsWith("mailto:");
    if (isExternalOrHash) {
      return (
        <a href={href} className={`${baseClasses} ${className}`} {...props}>
          {btnContent}
        </a>
      );
    }
    return (
      <Link to={href} className={`${baseClasses} ${className}`} {...props}>
        {btnContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`} {...props}>
      {btnContent}
    </button>
  );
}
