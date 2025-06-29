import React, { useState, useEffect } from 'react'
import cx from 'classnames'

const DevGrid = ({ className }) => {
  const [showGrid, setShowGrid] = useState(false)

  useEffect(() => {
    const handleOnKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'g') {
        setShowGrid((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleOnKeyDown)

    return () => {
      window.removeEventListener('keydown', handleOnKeyDown)
    }
  }, [])

  return (
    showGrid && (
      <div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full">
        <div
          className={cx(
            'h-full w-full site-grid-container section-x-spacing',
            className,
          )}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={cx('bg-current', {
                'hidden sm:block': i > 7,
              })}
            />
          ))}
        </div>
      </div>
    )
  )
}

export default DevGrid
