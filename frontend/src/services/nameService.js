const CYRILLIC_NAME_PATTERN = /^[\u0400-\u04FF ]{2,}/;

export function validateName(name) {
  if (name.length < 2) {
    return "Укажите имя";
  } else if (!CYRILLIC_NAME_PATTERN.test(name)) {
    return "Имя может содержать только кириллицу";
  }
  return null;
}
