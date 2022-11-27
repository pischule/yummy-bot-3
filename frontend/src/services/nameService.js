const CYRILLIC_NAME_PATTERN = /^[\u0400-\u04FF ]{2,}/;

export default function validateName(name) {
  if (name.length < 2) {
    return "Укажите имя";
  }
  if (!CYRILLIC_NAME_PATTERN.test(name)) {
    return "Имя может содержать только кириллицу";
  }
  return null;
}
