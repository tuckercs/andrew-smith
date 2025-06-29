import React from 'react'
import { Studio } from 'sanity'
import config from '../../sanity.config'

export default function StudioPage() {
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      // reset base styles for Sanity's styled components
      document.documentElement.style.fontSize = '14px'
      document.body.style.fontSize = '16px'
    }
  }, [])
  return (
    <div style={{ height: '100vh' }}>
      <Studio config={config} />
    </div>
  )
}
