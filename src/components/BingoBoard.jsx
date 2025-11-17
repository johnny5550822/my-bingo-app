import React, { useEffect, useRef, useState } from 'react'

function shuffle(array, seed) {
  // simple seeded shuffle (xorshift32)
  let x = (seed || Date.now()) & 0xffffffff
  const rand = () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return (x >>> 0) / 4294967295
  }
  const a = array.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function BingoBoard({ items = [], gridSize = 5, seed = 0, freeCenter = true, title = '', theme = 'classic', exportScale = 2 }) {
  const canvasRef = useRef(null)
  const [board, setBoard] = useState([])

  const themes = {
    classic: {
      background: '#ffffff', cellBg: '#fff', cellBorder: '#222', titleColor: '#000', textColor: '#111', accent: '#0b5fff', font: 'sans-serif'
    },
    pastel: {
      background: '#fffaf6', cellBg: '#fff1f8', cellBorder: '#f2d7ee', titleColor: '#5b3b8a', textColor: '#2b2b2b', accent: '#ff7ab6', font: 'Georgia'
    },
    dark: {
      background: '#0f1720', cellBg: '#0b1220', cellBorder: '#23303a', titleColor: '#ffffff', textColor: '#e6eef6', accent: '#7dd3fc', font: 'sans-serif'
    },
    ocean: {
      background: '#eaf6ff', cellBg: '#dff4ff', cellBorder: '#9ad1e8', titleColor: '#034f84', textColor: '#083344', accent: '#0077b6', font: 'Trebuchet MS'
    },
    sunset: {
      background: '#fff4ec', cellBg: '#fff0e6', cellBorder: '#f3c6a5', titleColor: '#7a2e2e', textColor: '#3b2f2f', accent: '#ff6b6b', font: 'Georgia'
    },
    retro: {
      background: '#fffbe6', cellBg: '#fff4cc', cellBorder: '#d8b56a', titleColor: '#5a3e36', textColor: '#3a2e2b', accent: '#f59e0b', font: 'Courier New'
    },
    forest: {
      background: '#e8f5e9', cellBg: '#c8e6c9', cellBorder: '#388e3c', titleColor: '#1b5e20', textColor: '#2e7d32', accent: '#43a047', font: 'Verdana'
    },
    lavender: {
      background: '#f3e8ff', cellBg: '#e1bee7', cellBorder: '#8e24aa', titleColor: '#6a1b9a', textColor: '#4a148c', accent: '#ba68c8', font: 'Tahoma'
    },
    lemon: {
      background: '#fffde7', cellBg: '#fff9c4', cellBorder: '#fbc02d', titleColor: '#f57c00', textColor: '#7c4700', accent: '#ffd600', font: 'Arial'
    },
    slate: {
      background: '#eceff1', cellBg: '#cfd8dc', cellBorder: '#607d8b', titleColor: '#263238', textColor: '#37474f', accent: '#90a4ae', font: 'Helvetica'
    }
  }
  const themeObj = themes[theme] || themes.classic

  useEffect(() => {
    const cells = gridSize * gridSize
    const hasCenterFree = freeCenter && gridSize % 2 === 1
    const need = cells - (hasCenterFree ? 1 : 0)
    const pool = items.length >= need ? items : [...items, ...Array(need - items.length).fill('')]
    const chosen = shuffle(pool, seed || 12345).slice(0, need)
    const filled = []
    let idx = 0
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (hasCenterFree && r === Math.floor(gridSize/2) && c === Math.floor(gridSize/2)) {
          filled.push('FREE')
        } else {
          filled.push(chosen[idx++] || '')
        }
      }
    }
    setBoard(filled)
  }, [items, gridSize, seed, freeCenter])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = Math.min(window.innerWidth - 40, 900)
    const cell = Math.floor(size / gridSize)

    // Title area (if title provided)
    const titleFontSize = Math.max(16, Math.floor(cell * 0.35))
    const titleAreaHeight = title ? Math.floor(titleFontSize * 1.8) : 0

    canvas.width = cell * gridSize
    canvas.height = titleAreaHeight + cell * gridSize

    // background
    ctx.fillStyle = themeObj.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw title
    if (title) {
      ctx.fillStyle = themeObj.titleColor
      ctx.font = `bold ${titleFontSize}px ${themeObj.font || 'sans-serif'}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(title, canvas.width / 2, titleAreaHeight / 2)
    }

    const cellPadding = Math.max(6, Math.floor(cell * 0.06))
    const cornerRadius = Math.max(6, Math.floor(cell * 0.06))

    // draw cells with rounded background
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const x = c * cell
        const y = titleAreaHeight + r * cell
        // background
        ctx.fillStyle = themeObj.cellBg
        roundRect(ctx, x + 4, y + 4, cell - 8, cell - 8, cornerRadius)
        ctx.fill()
        // border
        ctx.lineWidth = Math.max(1, Math.floor(cell * 0.03))
        ctx.strokeStyle = themeObj.cellBorder
        ctx.stroke()
      }
    }

    // text styles: scale with cell
    ctx.fillStyle = themeObj.textColor
    const baseFontSize = Math.max(12, Math.floor(cell * 0.14))
    ctx.font = `bold ${baseFontSize}px ${themeObj.font || 'sans-serif'}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const maxTextWidth = cell * 0.8
    const lineHeight = Math.max(16, Math.floor(baseFontSize * 1.2))

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const txt = board[r * gridSize + c] || ''
        const cx = c * cell + cell / 2
        const cy = titleAreaHeight + r * cell + cell / 2
        drawWrappedText(ctx, String(txt), cx, cy, maxTextWidth, lineHeight)
      }
    }
  }, [board, gridSize])

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return
    const words = text.split(' ')
    const lines = []
    let line = ''
    for (let i = 0; i < words.length; i++) {
      const testLine = line ? `${line} ${words[i]}` : words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line) {
        lines.push(line)
        line = words[i]
      } else {
        line = testLine
      }
    }
    if (line) lines.push(line)

    // If still too wide for single-word overflow, break long words
    for (let i = 0; i < lines.length; i++) {
      while (ctx.measureText(lines[i]).width > maxWidth) {
        // force split
        const l = lines[i]
        const splitAt = Math.floor(l.length * 0.6) || 1
        const a = l.slice(0, splitAt)
        const b = l.slice(splitAt)
        lines.splice(i, 1, a, b)
      }
    }

    const totalHeight = lines.length * lineHeight
    const startY = y - totalHeight / 2 + lineHeight / 2
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, startY + i * lineHeight)
    }
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    const r = Math.min(radius, width / 2, height / 2)
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + width, y, x + width, y + height, r)
    ctx.arcTo(x + width, y + height, x, y + height, r)
    ctx.arcTo(x, y + height, x, y, r)
    ctx.arcTo(x, y, x + width, y, r)
    ctx.closePath()
  }

  function downloadPNG() {
    const canvas = canvasRef.current
    if (!canvas) return
    // create a scaled copy for higher-resolution export
    const scale = exportScale || 1
    if (scale === 1) {
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `bingo-${gridSize}x${gridSize}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      return
    }

    const scaled = document.createElement('canvas')
    scaled.width = canvas.width * scale
    scaled.height = canvas.height * scale
    const sctx = scaled.getContext('2d')
    // white background
    sctx.fillStyle = themeObj.background || '#fff'
    sctx.fillRect(0, 0, scaled.width, scaled.height)
    sctx.imageSmoothingEnabled = true
    sctx.drawImage(canvas, 0, 0, scaled.width, scaled.height)
    const url = scaled.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    // include title (sanitized) in filename
    const safeTitle = (title || 'bingo').replace(/[^0-9a-zA-Z-_]/g, '-')
    a.download = `${safeTitle}-${gridSize}x${gridSize}@${scale}x.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="bingo-wrapper">
      <div className="canvas-wrap">
        <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd' }} />
      </div>
      <div className="actions">
        <button onClick={downloadPNG}>Download PNG</button>
      </div>
    </div>
  )
}
