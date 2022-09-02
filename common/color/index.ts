export const hexToRgb = (hex: string) => {
  const shortHandRegex = RegExp(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
  const hexString = hex.replace(shortHandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const finalHex = hexString.startsWith("#") ? hexString.slice(1) : hexString;

  return {
    r: parseInt(`${finalHex[0]}${finalHex[1]}`, 16),
    g: parseInt(`${finalHex[2]}${finalHex[3]}`, 16),
    b: parseInt(`${finalHex[4]}${finalHex[5]}`, 16),
  };
};
