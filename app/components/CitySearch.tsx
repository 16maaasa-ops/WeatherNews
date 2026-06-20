'use client'

import { useState, useRef } from 'react'

interface Props {
  onSearch: (city: string) => void
  onLocate: () => void
  loading: boolean
}

export default function CitySearch({ onSearch, onLocate, loading }: Props) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit() {
    const city = input.trim()
    if (!city) return
    onSearch(city)
    setInput('')
    inputRef.current?.blur()
  }

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSubmit()}
        placeholder="都市名を入力（例: Tokyo, Osaka）"
        aria-label="都市名を入力"
        disabled={loading}
        className="flex-1 rounded-xl border border-white/30 bg-white/20 backdrop-blur px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || loading}
        className="rounded-xl bg-white/25 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/35 disabled:opacity-40 disabled:cursor-not-allowed transition-colors backdrop-blur"
      >
        検索
      </button>
      <button
        onClick={onLocate}
        disabled={loading}
        aria-label="現在地を取得"
        title="現在地を使用"
        className="rounded-xl bg-white/25 px-3 py-2.5 text-white hover:bg-white/35 disabled:opacity-40 disabled:cursor-not-allowed transition-colors backdrop-blur"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.087 3.657-5.115 3.657-8.978C20.945 6.093 16.886 2 12 2c-4.887 0-8.945 4.093-8.945 8.35 0 3.863 1.713 6.89 3.657 8.978a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
