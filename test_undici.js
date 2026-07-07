const { Agent, fetch } = require('undici');
const dns = require('dns');

function isUrlSafe(urlString) {
  try {
    const parsedUrl = new URL(urlString)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return false
    let hostname = parsedUrl.hostname
    if (hostname.startsWith('[') && hostname.endsWith(']')) hostname = hostname.slice(1, -1)
    if (hostname === 'localhost' || hostname === '0.0.0.0') return false
    if (hostname === '::1' || hostname === '::' || hostname === '0:0:0:0:0:0:0:0' || hostname === '0:0:0:0:0:0:0:1') return false
    if (hostname.startsWith('10.')) return false
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return false
    if (hostname.startsWith('192.168.')) return false
    if (hostname.startsWith('127.')) return false
    if (hostname.startsWith('169.254.')) return false
    if (/^(fc|fd|fe8|fe9|fea|feb)[0-9a-f]{0,2}:/i.test(hostname)) return false
    const lowerHost = hostname.toLowerCase()
    if (lowerHost.startsWith('::ffff:')) {
      const mapped = lowerHost.slice(7)
      if (mapped.startsWith('127.') || /^7f[0-9a-f]{2}:/i.test(mapped)) return false
      if (mapped.startsWith('10.') || /^a[0-9a-f]{2}:/i.test(mapped)) return false
      if (mapped.startsWith('192.168.') || /^c0a8:/i.test(mapped)) return false
      if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(mapped) || /^ac1[0-9a-f]:/i.test(mapped)) return false
      if (mapped.startsWith('169.254.') || /^a9fe:/i.test(mapped)) return false
      if (mapped === '0.0.0.0' || mapped === '0' || mapped.startsWith('00')) return false
    }
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) return false
    return true
  } catch {
    return false
  }
}

function createSafeDispatcher() {
  const customLookup = (hostname, options, callback) => {
    dns.lookup(hostname, options, (err, address, family) => {
      if (err) return callback(err, address, family);

      const addresses = Array.isArray(address) ? address : [{ address, family }];
      const safeAddresses = addresses.filter(addr => {
        // Handle IPv6 bracket notation for URL parsing
        const ipString = addr.family === 6 ? `[${addr.address}]` : addr.address;
        return isUrlSafe(`http://${ipString}`);
      });

      if (safeAddresses.length === 0) {
        return callback(new Error('Forbidden IP'), address, family);
      }

      callback(null, Array.isArray(address) ? safeAddresses : safeAddresses[0].address, family);
    });
  };

  return new Agent({
    connect: { lookup: customLookup }
  });
}

async function run() {
  const dispatcher = createSafeDispatcher();
  try {
    const res = await fetch('https://google.com', { dispatcher });
    console.log(res.status);
    console.log(await res.text());
  } catch(e) {
    console.log("error", e);
  }
}
run();
