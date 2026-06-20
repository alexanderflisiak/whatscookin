async function testStream() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode("Hello "));
      controller.enqueue(encoder.encode("World!".repeat(100000))); // Very large
      controller.close();
    }
  });

  const response = new Response(stream);

  const MAX_BYTES = 100 * 1024; // 100 KB
  let bytesRead = 0;
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let html = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.length;
      if (bytesRead > MAX_BYTES) {
        await reader.cancel();
        console.log('Response too large caught');
        return { error: 'Response too large', status: 413 };
      }

      html += decoder.decode(value, { stream: true });
    }
    html += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return { html: html.substring(0, 100), status: 200 };
}

testStream().then(console.log).catch(console.error);
