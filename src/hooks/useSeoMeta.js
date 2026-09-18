import { useEffect } from 'react'

const BASE_URL = 'https://thecrustculture.com'

function setOrCreateMeta(selector, attribute, attributeValue, contentValue) {
  let element = document.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, attributeValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', contentValue)
  return element
}

function setOrCreateCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
  return link
}

/**
 * Custom hook to dynamically manage page-specific SEO metadata, canonical URLs,
 * and crawler robots directives across React Router route transitions.
 */
export function useSeoMeta({
  title,
  description,
  canonicalPath,
  robots = 'index, follow, max-image-preview:large',
  ogImage,
} = {}) {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title
      setOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', title)
      setOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    }

    // 2. Description
    if (description) {
      setOrCreateMeta('meta[name="description"]', 'name', 'description', description)
      setOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', description)
      setOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    }

    // 3. Canonical URL
    if (canonicalPath !== undefined) {
      const cleanPath = canonicalPath === '/' ? '' : canonicalPath.replace(/\/$/, '')
      const fullCanonicalUrl = `${BASE_URL}${cleanPath}`
      setOrCreateCanonical(fullCanonicalUrl)
      setOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', fullCanonicalUrl)
    }

    // 4. Meta Robots Directives
    if (robots) {
      setOrCreateMeta('meta[name="robots"]', 'name', 'robots', robots)
    }

    // 5. Open Graph Image (if custom per page)
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`
      setOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', fullImageUrl)
      setOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', fullImageUrl)
    }
  }, [title, description, canonicalPath, robots, ogImage])
}
