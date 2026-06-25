import { useState, useEffect } from 'react'

export function useTypewriterAnimation(words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
  const [displayedText, setDisplayedText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    const isComplete = displayedText === currentWord

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(prev => prev.slice(0, -1))
        if (displayedText.length === 1) {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      } else {
        if (!isComplete) {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayedText, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration])

  return displayedText
}
