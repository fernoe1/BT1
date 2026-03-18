export const TOKEN_ADDRESS = "0xdb2A8F53f4e19D2795bB9B592495aDe816656f68";

export const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];
