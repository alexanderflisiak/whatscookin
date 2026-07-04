import dns from 'dns/promises'

async function isUrlSafe(urlString: string): Promise<boolean> {
  try {
    const parsedUrl = new URL(urlString)

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false
    }

    let hostname = parsedUrl.hostname

    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1)
    }

    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) return false

    const { address: ip } = await dns.lookup(hostname)
    console.log(`Resolved ${hostname} to ${ip}`)

    if (ip === 'localhost' || ip === '0.0.0.0') return false

    if (ip === '::1' || ip === '::' || ip === '0:0:0:0:0:0:0:0' || ip === '0:0:0:0:0:0:0:1') return false

    if (ip.startsWith('10.')) return false
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return false
    if (ip.startsWith('192.168.')) return false
    if (ip.startsWith('127.')) return false
    if (ip.startsWith('169.254.')) return false

    if (/^(fc|fd|fe8|fe9|fea|feb)[0-9a-f]{0,2}:/i.test(ip)) return false

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
  } catch (err) {
    console.error(err)
    return false
  }
}

async function runTests() {
  const urls = [
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'https://google.com',
    'http://localtest.me', // resolves to 127.0.0.1
    'http://169.254.169.254/latest/meta-data/', // AWS metadata
  ]

  for (const url of urls) {
    const safe = await isUrlSafe(url)
    console.log(`URL: ${url} -> Safe: ${safe}\n`)
  }
}

runTests()
