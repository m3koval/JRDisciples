import type { CSSProperties, ReactNode } from 'react'

type ExternalSourceLinkProps = {
  href: string
  children: ReactNode
  appLabel?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Keeps source links useful on the website while preventing an ungated child
 * from leaving the Kids Category app. A parental gate can replace the app-side
 * label in a later release without changing lesson content.
 */
export function ExternalSourceLink({ href, children, appLabel, className, style }: ExternalSourceLinkProps) {
  if (process.env.NEXT_PUBLIC_APP_SHELL === '1') {
    return (
      <span className={className} style={style} data-external-source-disabled="app">
        {appLabel ?? children}
      </span>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} style={style}>
      {children}
    </a>
  )
}
