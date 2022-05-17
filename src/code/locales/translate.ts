import en from './en.json';

const translations = en;

export function translate(key: keyof typeof translations, params?: { [s: string]: string } | undefined): string {
  let translation = translations[key];

  if (!translation) {
    return key;
  }

  if (!params) {
    return translation;
  }

  Object.entries(params).forEach(([keyToReplace, value]) => {
    translation = translation
      .replace(`{{ ${keyToReplace} }}`, value.toString())
      .replace(`{{${keyToReplace}}}`, value.toString());
  });

  return translation;
}

