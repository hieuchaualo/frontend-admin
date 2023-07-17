import { useEffect, useRef, useState } from 'react'

function TimeCountdown({ timeRemaining, className }) {
  const [timeCountdown, setTimeCountdown] = useState(timeRemaining)
  const timer = useRef(timeRemaining)
  const lastTimeCountdown = useRef(timeRemaining)

  useEffect(() => {
    if (timer.current !== timeRemaining) {
      timer.current = timeRemaining
      lastTimeCountdown.current = timeRemaining
      setTimeCountdown(timeRemaining)
    }
  }, [timeRemaining])

  useEffect(() => {
    if (timeCountdown > 0 && (lastTimeCountdown.current === timeCountdown)) {
      lastTimeCountdown.current = timeCountdown - 1
      setTimeout(setTimeCountdown, 1000, timeCountdown - 1)
    } 
  }, [timeCountdown])

  if (timeCountdown < 0) return (<span className={className + ' text-danger'}>0d 0h 0m 0s</span>)
  return (
    <span className={className}>
      {Math.floor(timeCountdown / 86400)}d { }
      {Math.floor((timeCountdown % 86400) / 3600 % 24)}h { }
      {Math.floor((timeCountdown % 86400) / 60 % 60)}m { }
      {Math.floor((timeCountdown % 86400) % 60)}s { }
    </span>
  )
}

export { TimeCountdown }