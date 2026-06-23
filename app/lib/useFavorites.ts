'use client'
import { useState, useEffect } from 'react'

const KEY = 'weather-favorites'
const MAX = 5

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored) {
      try { setFavorites(JSON.parse(stored)) } catch { setFavorites([]) }
    }
  }, [])

  function save(next: string[]) {
    setFavorites(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  function add(city: string) {
    if (favorites.includes(city) || favorites.length >= MAX) return
    save([...favorites, city])
  }

  function remove(city: string) {
    save(favorites.filter(c => c !== city))
  }

  function moveLeft(index: number) {
    if (index <= 0) return
    const next = [...favorites]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    save(next)
  }

  function moveRight(index: number) {
    if (index >= favorites.length - 1) return
    const next = [...favorites]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    save(next)
  }

  return { favorites, add, remove, moveLeft, moveRight }
}
