import React, { useId } from 'react'
import * as Toggle from '@radix-ui/react-toggle'
import cx from 'classnames'

import Icon from '@components/icon'

const PlayPause = ({ isPaused, onClick, className, ...rest }) => {
  const id = useId()
  return (
    <Toggle.Root pressed={isPaused} onPressedChange={onClick} asChild>
      <button
        aria-label={`${isPaused ? 'Play' : 'Pause'} Video`}
        className={cx('clean-btn h-30 w-30', className)}
        {...rest}
      >
        <div className="content-button h-full w-full flex justify-center">
          <Icon
            name={isPaused ? 'Play' : 'Pause'}
            viewBox={isPaused ? '0 0 11 13' : '0 0 12 12'}
            color="#000"
            className={cx('w-10', {})}
          />
        </div>
      </button>
    </Toggle.Root>
  )
}

export default PlayPause
