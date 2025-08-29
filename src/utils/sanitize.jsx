export const sanitizePlate = (s = "") =>
  s
    .toUpperCase()
    .normalize("NFKD")       
    .replace(/\s+/g, "")  
    .replace(/[^A-Z0-9]/g, "");
