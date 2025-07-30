async function generateHMAC() {
  const msg = document.getElementById('message').value.trim();
  const key = document.getElementById('secret').value.trim();
  const algo = document.getElementById('algorithm').value;
  const output = document.getElementById('output');
  const error = document.getElementById('error');

  output.style.display = 'none';
  error.textContent = '';

  if (!msg || !key) {
    error.textContent = '⚠️ Please enter both message and secret key.';
    return;
  }

  try {
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(key);
    const messageBytes = encoder.encode(msg);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: { name: algo } },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    output.innerHTML = `<strong>HMAC (${algo}):</strong><br>${hashHex}`;
    output.style.display = 'block';
  } catch (err) {
    error.textContent = '❌ Error computing HMAC. Algorithm may not be supported in this browser.';
    console.error(err);
  }
}
