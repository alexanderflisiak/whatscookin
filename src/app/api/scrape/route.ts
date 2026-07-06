import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import http from 'http'
import https from 'https'
import dns from 'dns/promises'
import net from 'net'

function isIpSafe(ip: string | undefined): boolean {
  if (!ip) return false

  // Block localhost and 0.0.0.0
  if (ip === 'localhost' || ip === '0.0.0.0') return false

  // Block IPv6 localhost and unspecified
  if (ip === '::1' || ip === '::' || ip === '0:0:0:0:0:0:0:0' || ip === '0:0:0:0:0:0:0:1') return false

  // Block private IP ranges (IPv4)
  // 10.0.0.0 - 10.255.255.255
  if (ip.startsWith('10.')) return false
  // 172.16.0.0 - 172.31.255.255
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return false
  // 192.168.0.0 - 192.168.255.255
  if (ip.startsWith('192.168.')) return false
  // 127.0.0.0 - 127.255.255.255 (loopback)
  if (ip.startsWith('127.')) return false
  // 169.254.0.0 - 169.254.255.255 (link-local)
  if (ip.startsWith('169.254.')) return false

  // Block IPv6 Unique Local Addresses (fc00::/7) and Link-Local (fe80::/10)
  if (/^(fc|fd|fe8|fe9|fea|feb)[0-9a-f]{0,2}:/i.test(ip)) return false

  // Block IPv4-mapped IPv6 addresses
  const lowerHost = ip.toLowerCase()
  if (lowerHost.startsWith('::ffff:')) {
    const mapped = lowerHost.slice(7)
    if (mapped.startsWith('127.') || /^7f[0-9a-f]{2}:/i.test(mapped)) return false
    if (mapped.startsWith('10.') || /^a[0-9a-f]{2}:/i.test(mapped)) return false
    if (mapped.startsWith('192.168.') || /^c0a8:/i.test(mapped)) return false
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(mapped) || /^ac1[0-9a-f]:/i.test(mapped)) return false
    if (mapped.startsWith('169.254.') || /^a9fe:/i.test(mapped)) return false
    if (mapped === '0.0.0.0' || mapped === '0' || mapped.startsWith('00')) return false
  }

  return true
}

// Custom fetch wrapper using native HTTP/HTTPS with DNS rebinding protection
async function safeFetchWithDnsPinning(urlStr: string) {
  return new Promise<{ status: number, ok: boolean, html: string, location: string | null }>((resolve, reject) => {
    let parsed: URL
    try {
      parsed = new URL(urlStr)
    } catch {
      return reject(new Error('Invalid URL'))
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return reject(new Error('Invalid protocol'))
    }

    if (parsed.hostname.endsWith('.local') || parsed.hostname.endsWith('.internal')) {
      return reject(new Error('Internal domain blocked'))
    }

    const lib = parsed.protocol === 'https:' ? https : http

    const agent = new lib.Agent({
      // Provide custom DNS lookup to resolve and pin the IP before connection
      lookup: (hostname, options, callback) => {
        if (net.isIP(hostname)) {
          if (!isIpSafe(hostname)) {
            return callback(new Error('Unsafe IP resolved: ' + hostname), hostname, net.isIPv6(hostname) ? 6 : 4)
          }
          return callback(null, hostname, net.isIPv6(hostname) ? 6 : 4)
        }

        dns.lookup(hostname).then((res) => {
          if (!isIpSafe(res.address)) {
            return callback(new Error('Unsafe IP resolved: ' + res.address), res.address, res.family)
          }
          callback(null, res.address, res.family)
        }).catch(err => callback(err, '', 4))
      }
    })

    const req = lib.request(parsed, {
      method: 'GET',
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          status: res.statusCode || 500,
          ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
          html: data,
          location: res.headers.location || null
        })
      })
    })

    req.on('error', reject)
    // Abort if taking too long to prevent hanging connections
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Timeout'))
    })
    req.end()
  })
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    let currentUrl = url
    let responseResult: { status: number, ok: boolean, html: string, location: string | null } | null = null
    const MAX_REDIRECTS = 5

    // Fetch loop to follow redirects securely
    for (let i = 0; i <= MAX_REDIRECTS; i++) {
      try {
        responseResult = await safeFetchWithDnsPinning(currentUrl)
      } catch (err: unknown) {
        return NextResponse.json({ error: 'Invalid or forbidden URL' }, { status: 400 })
      }

      // If it's a redirect, get the Location header and continue loop
      if (responseResult.status >= 300 && responseResult.status < 400) {
        const location = responseResult.location
        if (!location) break
        // Resolve relative redirects
        try {
          currentUrl = new URL(location, currentUrl).toString()
        } catch {
          break
        }
        continue
      }

      break // Not a redirect, exit loop
    }

    if (!responseResult || !responseResult.ok) {
      return NextResponse.json({ error: 'Failed to access URL' }, { status: 400 })
    }

    const html = responseResult.html
    const $ = cheerio.load(html)
    
    let recipeData: any = null

    // 1. Primary Method: JSON-LD Parse
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}')
        
        // JSON-LD can be an array or an object, or an object containing a graph array
        const findRecipe = (obj: any): any => {
          if (Array.isArray(obj)) {
            for (const item of obj) {
              const res = findRecipe(item)
              if (res) return res
            }
          } else if (typeof obj === 'object' && obj !== null) {
            if (obj['@type'] === 'Recipe' || (Array.isArray(obj['@type']) && obj['@type'].includes('Recipe'))) {
              return obj
            }
            if (obj['@graph']) return findRecipe(obj['@graph'])
          }
          return null
        }

        const ldRecipe = findRecipe(json)
        
        if (ldRecipe) {
          // Extract Image
          let imageUrl = null
          if (Array.isArray(ldRecipe.image)) imageUrl = ldRecipe.image[0]
          else if (typeof ldRecipe.image === 'string') imageUrl = ldRecipe.image
          else if (ldRecipe.image && ldRecipe.image.url) imageUrl = ldRecipe.image.url

          // Extract Ingredients
          let ingredients: string[] = []
          if (Array.isArray(ldRecipe.recipeIngredient)) {
            ingredients = ldRecipe.recipeIngredient
          }

          // Extract Instructions
          let instructions = ''
          if (Array.isArray(ldRecipe.recipeInstructions)) {
            instructions = ldRecipe.recipeInstructions
              .map((step: any, idx: number) => {
                const text = typeof step === 'string' ? step : step.text
                return `${idx + 1}. ${text}`
              })
              .join('\n\n')
          }

          // Extract Time (ISO 8601 duration string like "PT15M")
          let cookTime = null
          if (ldRecipe.totalTime) {
            const match = ldRecipe.totalTime.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
            if (match) {
              const hours = parseInt(match[1] || '0')
              const minutes = parseInt(match[2] || '0')
              cookTime = hours * 60 + minutes
            }
          }

          recipeData = {
            title: ldRecipe.name || '',
            image_url: imageUrl,
            ingredients,
            instructions,
            cook_time: cookTime,
          }
        }
      } catch (err) {
        // parsing error, move to next script
      }
    })

    // 2. Fallback Method: Cheerio selectors if JSON-LD isn't found
    if (!recipeData) {
      const title = $('h1').first().text().trim() || $('title').text().replace(/Recipe|\|.+/ig, '').trim()
      
      const ingredients: string[] = []
      $('[class*="ingredient"] li, [class*="Ingredient"] li').each((_, el) => {
        ingredients.push($(el).text().trim().replace(/\\s+/g, ' '))
      })

      const instructionsList: string[] = []
      $('[class*="instruction"] li, [class*="Instruction"] li, [class*="step"] p').each((_, el) => {
        instructionsList.push($(el).text().trim().replace(/\\s+/g, ' '))
      })

      const image_url = $('meta[property="og:image"]').attr('content') || null

      recipeData = {
        title,
        image_url,
        ingredients,
        instructions: instructionsList.map((step, i) => `${i + 1}. ${step}`).join('\n\n'),
        cook_time: null,
      }
    }

    // Tokenize ingredients
    const tokenizedIngredients = (recipeData.ingredients || []).map((ing: string) => {
      // Very loose heuristic for amount / unit / name
      const match = ing.match(/^([\d\s¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞.\-\/]+)\s*([a-zA-Z]+)?\s+(.+)$/)
      if (match) {
        return {
          amount: match[1].trim(),
          unit: match[2] ? match[2].trim() : null,
          name: match[3].trim(),
        }
      }
      return { amount: null, unit: null, name: ing.trim() }
    })

    return NextResponse.json({
      ...recipeData,
      ingredients: tokenizedIngredients,
      source_url: url
    })

  } catch (error: any) {
    // Log the error internally but do not leak the exact cause to the client
    console.error('Scraping error:', error)
    return NextResponse.json({ error: 'Failed to process the URL' }, { status: 500 })
  }
}
