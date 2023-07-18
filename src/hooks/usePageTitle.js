import { useEffect } from "react"

const BRAND_NAME = 'SS Reading Master'

/**
 * @use Set page title with brand name: BRAND_NAME - pageTitle
 */
const usePageTitle = pageTitle => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${BRAND_NAME} - ${pageTitle}`
    return () => {
      document.title = prevTitle
    }
  }, [pageTitle])
}

export {
  usePageTitle,
}
