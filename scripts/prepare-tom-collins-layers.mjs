import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("D:/Code/Last Call");
const dir = path.join(root, "public/images/cocktails");
const basePath = path.join(dir, "tom-collins-base.png");
const width = 2400;
const height = 3000;

const transparentSvg = (body) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`,
  );

async function writeSvg(name, body) {
  await sharp(transparentSvg(body)).png().toFile(path.join(dir, name));
}

async function writeRefraction() {
  const { data, info } = await sharp(basePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  const index = (x, y) => (y * info.width + x) * 4;
  const luminance = (x, y) => {
    const i = index(Math.max(0, Math.min(info.width - 1, x)), Math.max(0, Math.min(info.height - 1, y)));
    return data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
  };

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const i = index(x, y);
      const alpha = data[i + 3];
      if (alpha < 18) continue;
      const edge =
        Math.abs(luminance(x + 1, y) - luminance(x - 1, y)) +
        Math.abs(luminance(x, y + 1) - luminance(x, y - 1));
      if (edge < 74) continue;
      const a = Math.min(26, Math.max(4, Math.round((edge - 74) * 0.24))) * (alpha / 255);
      out[i] = 221;
      out[i + 1] = 231;
      out[i + 2] = 226;
      out[i + 3] = Math.round(a);
    }
  }

  const raster = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .blur(0.35)
    .png()
    .toBuffer();

  const contourSvg = transparentSvg(`
    <g fill="none" stroke="#e5eee9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M784 416 C774 790 778 1200 780 1680 C781 2040 790 2338 824 2505" stroke-width="12" opacity=".14"/>
      <path d="M1738 418 C1748 820 1742 1260 1740 1710 C1738 2080 1727 2350 1698 2505" stroke-width="11" opacity=".11"/>
      <path d="M804 357 C924 273 1584 270 1718 357" stroke-width="9" opacity=".16"/>
      <path d="M820 2512 C1010 2588 1508 2590 1690 2510" stroke-width="10" opacity=".13"/>
    </g>
  `);
  const combined = await sharp(raster).composite([{ input: contourSvg }]).png().toBuffer();
  await fs.writeFile(path.join(dir, "tom-collins-refraction.png"), combined);
}

await writeSvg(
  "tom-collins-lemon-peel.png",
  `
    <defs>
      <linearGradient id="peel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8a7616" stop-opacity=".82"/>
        <stop offset=".28" stop-color="#c8ac28" stop-opacity=".9"/>
        <stop offset=".56" stop-color="#efd45b" stop-opacity=".92"/>
        <stop offset=".82" stop-color="#c5a927" stop-opacity=".88"/>
        <stop offset="1" stop-color="#837318" stop-opacity=".78"/>
      </linearGradient>
      <pattern id="pores" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="8" r="1.8" fill="#fff0a0" opacity=".34"/>
        <circle cx="18" cy="20" r="1.25" fill="#766714" opacity=".26"/>
        <circle cx="25" cy="5" r=".9" fill="#fff4af" opacity=".28"/>
      </pattern>
      <filter id="peel-texture" x="-20%" y="-5%" width="140%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="17" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="peel-soft" x="-20%" y="-10%" width="140%" height="120%"><feGaussianBlur stdDeviation=".8"/></filter>
    </defs>
    <path d="M1518 1770 C1494 1638 1510 1512 1550 1370 C1585 1242 1568 1138 1530 1032 C1496 933 1536 835 1573 746 C1611 651 1587 562 1550 480 C1535 445 1548 408 1590 370 L1633 390 C1604 421 1594 446 1612 484 C1651 570 1674 656 1635 765 C1600 851 1555 941 1594 1024 C1636 1132 1652 1248 1611 1381 C1570 1510 1545 1625 1574 1755 Z" fill="#645513" opacity=".2" filter="url(#peel-soft)"/>
    <path d="M1518 1770 C1494 1638 1510 1512 1550 1370 C1585 1242 1568 1138 1530 1032 C1496 933 1536 835 1573 746 C1611 651 1587 562 1550 480 C1535 445 1548 408 1590 370 L1633 390 C1604 421 1594 446 1612 484 C1651 570 1674 656 1635 765 C1600 851 1555 941 1594 1024 C1636 1132 1652 1248 1611 1381 C1570 1510 1545 1625 1574 1755 Z" fill="url(#peel)" opacity=".88" filter="url(#peel-texture)"/>
    <path d="M1518 1770 C1494 1638 1510 1512 1550 1370 C1585 1242 1568 1138 1530 1032 C1496 933 1536 835 1573 746 C1611 651 1587 562 1550 480 C1535 445 1548 408 1590 370 L1633 390 C1604 421 1594 446 1612 484 C1651 570 1674 656 1635 765 C1600 851 1555 941 1594 1024 C1636 1132 1652 1248 1611 1381 C1570 1510 1545 1625 1574 1755 Z" fill="url(#pores)" opacity=".42"/>
    <path d="M1533 1750 C1512 1623 1527 1510 1565 1374 C1599 1246 1582 1141 1544 1036 C1511 937 1551 841 1588 752 C1624 660 1600 571 1564 485" fill="none" stroke="#fff0a0" stroke-width="8" stroke-linecap="round" opacity=".28"/>
    <path d="M1597 396 C1575 421 1569 447 1584 481" fill="none" stroke="#6e5c13" stroke-width="5" stroke-linecap="round" opacity=".4"/>
  `,
);

await writeSvg(
  "tom-collins-shadow.png",
  `
    <defs>
      <filter id="blur" x="-25%" y="-100%" width="150%" height="300%"><feGaussianBlur stdDeviation="24"/></filter>
    </defs>
    <ellipse cx="1258" cy="2534" rx="430" ry="58" fill="#1c1712" opacity=".08" filter="url(#blur)"/>
  `,
);

await writeRefraction();

const composite = await sharp({
  create: { width, height, channels: 4, background: { r: 239, g: 225, b: 200, alpha: 1 } },
})
  .composite([
    { input: path.join(dir, "tom-collins-shadow.png") },
    { input: basePath },
    { input: path.join(dir, "tom-collins-refraction.png") },
    { input: path.join(dir, "tom-collins-lemon-peel.png") },
    { input: path.join(dir, "tom-collins-rim.png") },
  ])
  .jpeg({ quality: 88 })
  .toFile(path.join(dir, "tom-collins-layers-qa.jpg"));

console.log(JSON.stringify({ outputs: [
  "tom-collins-lemon-peel.png",
  "tom-collins-shadow.png",
  "tom-collins-refraction.png",
  "tom-collins-layers-qa.jpg",
], composite }, null, 2));
