import React, { useState } from 'react'
import BingoBoard from './components/BingoBoard'

export default function App() {
  const [itemsText, setItemsText] = useState(
    [
      'BINGO', 'React', 'JavaScript', 'CSS', 'HTML', 'Node', 'Express', 'Vite', 'Canvas', 'Free',
      'Event', 'State', 'Hook', 'Component', 'Prop', 'Random', 'Shuffle', 'Download', 'PNG', 'Grid',
      'Party', 'Fun', 'Game', 'Card'
    ].join('\n')
  )
  const [gridSize, setGridSize] = useState(5)
  const [freeCenter, setFreeCenter] = useState(true)
  const [seed, setSeed] = useState(Date.now())
  const [title, setTitle] = useState('My Bingo')
  const [theme, setTheme] = useState('classic')

  function randomizeSeed() {
    setSeed(Date.now())
  }

  return (
    <div className="container">
      <header>
        <h1>Bingo Generator</h1>
        <p>
          Enter your bingo items below (one per line), choose grid size and theme, set a title, and click <b>Download PNG</b> to export your custom bingo card.
        </p>
      </header>

      <main>
        <section className="controls">
          <div className="row-controls">
            <label className="control-group">
              <span>Grid size</span>
              <input
                type="number"
                min="3"
                max="9"
                value={gridSize}
                onChange={(e) => setGridSize(Math.max(3, Math.min(9, Number(e.target.value) || 5)))}
              />
            </label>
            <label className="control-group">
              <span>Free center</span>
              <input type="checkbox" checked={freeCenter} onChange={(e)=>setFreeCenter(e.target.checked)} />
            </label>
            <label className="control-group">
              <span>Seed</span>
              <input type="number" value={seed} onChange={(e)=>setSeed(Number(e.target.value)||0)} style={{width:120}} />
              <button onClick={randomizeSeed} style={{marginLeft:8}}>Randomize</button>
            </label>
          </div>
          <div className="row-controls">
            <label className="control-group" style={{flex:2}}>
              <span>Title</span>
              <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} style={{width:'100%'}} />
            </label>
            <label className="control-group" style={{flex:1}}>
              <span>Theme</span>
              <select value={theme} onChange={(e)=>setTheme(e.target.value)} style={{width:'100%'}}>
                <option value="classic">Classic</option>
                <option value="pastel">Pastel</option>
                <option value="dark">Dark</option>
                <option value="ocean">Ocean</option>
                <option value="sunset">Sunset</option>
                <option value="retro">Retro</option>
                <option value="forest">Forest</option>
                <option value="lavender">Lavender</option>
                <option value="lemon">Lemon</option>
                <option value="slate">Slate</option>
              </select>
            </label>
          </div>
          <label className="items" style={{width:'100%', marginTop:16}}>
            Items (one per line):
            <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={12} style={{width:'100%', minWidth:480, fontSize:'1rem', resize:'vertical'}} />
          </label>
        </section>
        <section className="board">
          <BingoBoard
            items={itemsText.split('\n').map(s=>s.trim()).filter(Boolean)}
            gridSize={gridSize}
            seed={seed}
            freeCenter={freeCenter}
            title={title}
            theme={theme}
          />
        </section>
      </main>
    </div>
  )
}
