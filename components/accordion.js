import React, { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import cx from 'classnames'
import Icon from '@components/icon'

const Accordion = ({
  simple = false,
  toggle,
  onChange,
  id,
  title,
  children,
  isOpen,
}) => {
  const [open, setOpen] = useState(toggle)

  useEffect(() => {
    setOpen(toggle)
  }, [toggle])

  useEffect(() => {
    if (onChange) {
      onChange(id, open)
    }
  }, [open])

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  return (
    <div key={id} className="accordion">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={cx(
          `w-full flex justify-between items-center cursor-pointer border-b border-black/25  accordion--toggle${open ? ' is-open' : ''}`,
        )}
      >
        {!simple && (
          <div className={cx('text-left uppercase text-h4 my-5', {})}>
            {title}
          </div>
        )}

        <span className="text-accent is-body-large">
          <div className={cx('w-20 h-20 flex justify-center ', {})}>
            <Icon
              name="Plus"
              viewBox="0 0 13 13"
              color={'#000'}
              className={cx('w-10 transition-transform', { 'rotate-45': open })}
            />
          </div>
        </span>

        {simple && <div className={cx('text-h2', {})}>{title}</div>}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <m.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
            className=""
          >
            <div
              className={cx('accordion-content', {
                'py-10 mx-10': !simple,
                'ml-20': simple,
              })}
            >
              {children}
            </div>
          </m.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Accordion
