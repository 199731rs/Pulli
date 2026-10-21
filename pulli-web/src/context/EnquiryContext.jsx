import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'pulli-enquiry-v1'
const EnquiryContext = createContext(null)

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

// A visitor's shortlist of products. Each line is one product + finish + size.
export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(load)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // storage unavailable (private mode); the list still works for this visit
    }
  }, [items])

  const value = useMemo(() => {
    const keyOf = (i) => `${i.id}|${i.finish}|${i.size}`
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      open,
      setOpen,
      add(line) {
        setItems((cur) => {
          const k = keyOf(line)
          const hit = cur.find((i) => keyOf(i) === k)
          if (hit) return cur.map((i) => (keyOf(i) === k ? { ...i, qty: i.qty + line.qty } : i))
          return [...cur, line]
        })
      },
      update(index, qty) {
        setItems((cur) => cur.map((i, n) => (n === index ? { ...i, qty: Math.max(1, qty) } : i)))
      },
      remove(index) {
        setItems((cur) => cur.filter((_, n) => n !== index))
      },
      clear() {
        setItems([])
      },
    }
  }, [items, open])

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}

export const useEnquiry = () => useContext(EnquiryContext)
