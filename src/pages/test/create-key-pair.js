export async function generateKey(salt, password) {
  // create keyX pair
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' },
    },
    !!password,
    ['sign', 'verify'],
  )
  return key
}
