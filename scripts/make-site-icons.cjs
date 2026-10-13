// Normalize the transparent logo into browser and mobile icon sizes.
const sharp = require('sharp')
const fs = require('node:fs/promises')
const path = require('node:path')

;(async () => {
  const source = process.argv[2]
  if (!source) throw Error('Provide the transparent logo PNG path')
  const destination = path.resolve('public')
  await fs.copyFile(source, path.join(destination, 'pj-logo-transparent.png'))
  const logo = await sharp(source).trim().png().toBuffer()
  const resize = size => sharp(logo).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  for (const size of [32, 64]) await fs.writeFile(path.join(destination, `favicon-pj-${size}.png`), await resize(size))
  await fs.writeFile(path.join(destination, 'apple-touch-icon-pj.png'), await resize(180))
  const sizes = [16, 32, 48]
  const images = await Promise.all(sizes.map(resize))
  const header = Buffer.alloc(6 + images.length * 16)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach((image, index) => {
    const entry = 6 + index * 16
    header[entry] = sizes[index]
    header[entry + 1] = sizes[index]
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(image.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += image.length
  })
  await fs.writeFile(path.join(destination, 'favicon.ico'), Buffer.concat([header, ...images]))
  console.log('Saved transparent logo, PNG favicons, multi-size ICO, and mobile icon.')
})().catch(error => { console.error(error); process.exit(1) })
