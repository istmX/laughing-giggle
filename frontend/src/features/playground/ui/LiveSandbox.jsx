import React from 'react'
import { HeaderNav } from './components/HeaderNav'
import { HeroSection } from './components/HeroSection'
import { PaletteSection } from './components/PaletteSection'
import { TypographySection } from './components/TypographySection'
import { ComponentsSection } from './components/ComponentsSection'
import { ColorBlocksSection } from './components/ColorBlocksSection'
import { PricingSection } from './components/PricingSection'
import { FooterSection } from './components/FooterSection'

const hexToRgbStr = (hex) => {
  if (!hex || typeof hex !== 'string') return '247, 247, 247'
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map(x => x + x).join('')
  if (c.length !== 6) return '247, 247, 247'
  const num = parseInt(c, 16)
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`
}

export const LiveSandbox = ({ tokens = {} }) => {
  const colors = tokens?.colors || {}
  const primary = colors.primary || "#000000"
  const canvas = colors.canvas || "#F7F7F7"
  const surface = colors.surface || "#ffffff"
  const text = colors.text || "#000000"
  const border = colors.border || "#e2e2e2"
  const brand = colors.brand || primary
  const secondary = colors.secondary || "#333333"
  const accent = colors.accent || "#8B0A0A"

  const typo = tokens?.typography || {}
  const headingFont = typo.headingFont || "Satoshi, sans-serif"
  const bodyFont = typo.bodyFont || "Outfit, sans-serif"
  const radius = tokens?.radius || "32px"
  const brandName = tokens?.brandName || "RED LOVE"

  // Layout & Style Tokens
  const layout = tokens?.layout || {}
  const containerWidth = layout.containerWidth || "1120px"
  const sectionSpacing = layout.sectionSpacing || "80px"
  const itemGap = layout.itemGap || "24px"
  const alignment = layout.alignment || "left"

  const styleTokens = tokens?.style || {}
  const borderWidth = styleTokens.borderWidth || "1px"
  const glassmorphism = styleTokens.glassmorphism !== false

  const fontImports = React.useMemo(() => {
    const fontsToLoad = []
    const fontshareFonts = ['Satoshi', 'General Sans', 'Cabinet Grotesk', 'Clash Display']
    const googleFontsWithWeights = []
    const googleFontsSingleWeight = []
    const singleWeightFonts = ['Bebas Neue', 'Abril Fatface', 'Press Start 2P', 'Pacifico', 'Monoton']

    const checkAndAdd = (fontFamilyString) => {
      if (!fontFamilyString) return
      const fontName = fontFamilyString.split(',')[0].replace(/['"]/g, '').trim()
      if (['sans-serif', 'serif', 'monospace', 'system-ui'].includes(fontName.toLowerCase())) return
      
      if (fontshareFonts.includes(fontName)) {
        fontsToLoad.push(`@import url('https://api.fontshare.com/v2/css?f=${fontName.toLowerCase()}@300,400,500,700,900&display=swap');`)
      } else if (singleWeightFonts.includes(fontName)) {
        googleFontsSingleWeight.push(fontName)
      } else {
        googleFontsWithWeights.push(fontName)
      }
    }

    checkAndAdd(headingFont)
    checkAndAdd(bodyFont)

    const uniqueSingle = [...new Set(googleFontsSingleWeight)]
    const uniqueMulti = [...new Set(googleFontsWithWeights)]

    const fontParams = []
    if (uniqueSingle.length > 0) {
      uniqueSingle.forEach(f => fontParams.push(`family=${f.replace(/\s+/g, '+')}&display=swap`))
    }
    if (uniqueMulti.length > 0) {
      uniqueMulti.forEach(f => fontParams.push(`family=${f.replace(/\s+/g, '+')}:wght@300;400;500;700;900&display=swap`))
    }

    if (fontParams.length > 0) {
      fontsToLoad.push(`@import url('https://fonts.googleapis.com/css2?${fontParams.join('&')}');`)
    }

    return fontsToLoad.join('\n')
  }, [headingFont, bodyFont])

  const [activeTab, setActiveTab] = React.useState(0)
  const [tickerVal, setTickerVal] = React.useState(0)

  React.useEffect(() => {
    let frameId
    const startTime = performance.now()
    const duration = 1200
    const endValue = 12

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setTickerVal(Math.round(eased * endValue))
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  const bgRgb = hexToRgbStr(canvas)

  const isolatedStyle = {
    '--bg': canvas,
    '--bg-rgb': bgRgb,
    '--fg': text,
    '--primary': primary,
    '--surface': surface,
    '--border': border,
    '--brand': brand,
    '--secondary': secondary,
    '--accent': accent,
    '--heading-font': headingFont,
    '--body-font': bodyFont,
    '--radius': radius,
    '--container-max-width': containerWidth,
    '--section-spacing': sectionSpacing,
    '--item-gap': itemGap,
    '--text-align': alignment,
    '--border-width': borderWidth,
    backgroundColor: 'var(--bg)',
    color: 'var(--fg)',
    fontFamily: 'var(--body-font)',
    minHeight: '100%',
    width: '100%',
  }

  const systemSwatches = [
    { name: 'Primary / Ink', hex: primary, bg: 'var(--primary)', border: 'transparent' },
    { name: 'Canvas', hex: canvas, bg: 'var(--bg)', border: 'var(--border)' },
    { name: 'Surface Soft', hex: surface, bg: 'var(--surface)', border: 'var(--border)' },
    { name: 'Brand Accent', hex: brand, bg: 'var(--brand)', border: 'transparent' },
    { name: 'Secondary Dark', hex: secondary, bg: 'var(--secondary)', border: 'transparent' },
    { name: 'Deep Red Accent', hex: accent, bg: 'var(--accent)', border: 'transparent' },
  ]

  const colorBlocks = [
    { category: 'Creative Agency', desc: 'Bold brand identities & digital experiences for forward-thinking teams.', bg: 'var(--surface)', color: 'var(--fg)' },
    { category: 'Production Ready', desc: 'From initial design prompt to live responsive site, without code debt.', bg: 'var(--surface)', color: 'var(--fg)' },
    { category: 'Developer Specs', desc: 'Inspect typography matrices, color tokens, and layout guidelines in real time.', bg: 'var(--surface)', color: 'var(--fg)' },
    { category: 'Red Love Preview', desc: 'Glassmorphism navbar, tall headline typography, and rounded 32px pill controls.', bg: 'var(--surface)', color: 'var(--fg)' },
    { category: 'Red Love Agency Membership Open', desc: 'Save your spot for custom brand architecture, design tokens, and live interactive prototypes.', bg: 'var(--secondary)', color: '#ffffff', isPromo: true },
  ]

  const isTallFont = headingFont.toLowerCase().includes('bebas') || headingFont.toLowerCase().includes('satoshi')

  return (
    <div style={isolatedStyle} className="p-0 transition-all duration-500 rounded-b-2xl select-none min-h-full w-full">
      <style>{`
        ${fontImports}
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marqueeScroll 25s linear infinite;
        }
        .sandbox-container {
          max-width: var(--container-max-width);
          text-align: var(--text-align);
        }
        .sandbox-section {
          margin-bottom: var(--section-spacing);
        }
        .sandbox-grid {
          gap: var(--item-gap);
        }
        .display-xl { font-family: var(--heading-font); font-size: clamp(2.4rem, 6vw, 4.8rem); font-weight: 700; line-height: 1.05; letter-spacing: ${isTallFont ? '0.02em' : '-0.03em'}; text-transform: ${isTallFont ? 'uppercase' : 'none'}; }
        .display-lg { font-family: var(--heading-font); font-size: clamp(1.8rem, 4vw, 3.2rem); font-weight: 600; line-height: 1.12; letter-spacing: ${isTallFont ? '0.02em' : '-0.02em'}; text-transform: ${isTallFont ? 'uppercase' : 'none'}; }
      `}</style>

      <HeaderNav activeTab={activeTab} setActiveTab={setActiveTab} brandName={brandName} glassmorphism={glassmorphism} />
      <HeroSection brandName={brandName} alignment={alignment} />
      <PaletteSection systemSwatches={systemSwatches} />
      <TypographySection headingFont={headingFont} bodyFont={bodyFont} />
      <ComponentsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <ColorBlocksSection colorBlocks={colorBlocks} />
      <PricingSection tickerVal={tickerVal} />
      <FooterSection brandName={brandName} />
    </div>
  )
}
