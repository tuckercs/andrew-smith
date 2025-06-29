import React, { useState } from 'react'

const Input = ({
  value,
  type = 'text',
  loading,
  error,
  success,
  disabled,
  onClick,
  className,
  placeholder,
  label,
  name,
  onChange = () => {},
}) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const setFocusState = () => {
    if (value) {
      setFocused(true)
    } else {
      setFocused(false)
    }
  }

  let inputWrapperClassName = 'input-component relative inline-block w-full'
  if (className) {
    inputWrapperClassName += ' ' + className
  }
  if (error) {
    inputWrapperClassName += ' error'
  }
  if (success) {
    inputWrapperClassName += ' success'
  }
  if (loading) {
    inputWrapperClassName += ' loading'
  }
  if (disabled) {
    inputWrapperClassName += ' disabled'
  }
  if (label) {
    inputWrapperClassName += ' has-label'
  }
  if (placeholder) {
    inputWrapperClassName += ' has-placeholder'
  }

  if (type !== 'checkbox') {
    inputWrapperClassName += ' has-border'
  }

  if (type === 'checkbox') {
    inputWrapperClassName += ' checkbox'
  }
  return (
    <div className="relative">
      <label htmlFor={name} className={''}>
        <input
          className={inputWrapperClassName}
          type={type}
          placeholder={label}
          disabled={disabled}
          onClick={onClick}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocusState()}
          onChange={(event) => {
            if (onChange) {
              onChange(event)
            }
            if (event?.target?.value) {
              setFocused(true)
            }
          }}
          value={value}
          name={name}
          id={name}
        />
        {label && type === 'checkbox' && (
          <>
            <div className="check" />
            <span className="text-white/50">{label}</span>
          </>
        )}
      </label>
    </div>
  )
}

export default Input
