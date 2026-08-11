/* ===========================================================
   NOME CANÔNICO DA FONTE INTERNACIONAL

   O texto exibido pode chegar traduzido pelo parser conforme o
   idioma da interface. Emojis, conceitos e contextos editoriais
   precisam usar o nome inglês estável da própria definição para
   não mudarem quando o usuário troca de idioma.
=========================================================== */

export function resolveCanonicalProviderHolidayName({ definition, localizedName }) {
  const definitionName = definition?.name;

  if (typeof definitionName === 'string' && definitionName.trim()) {
    return definitionName;
  }

  if (typeof definitionName?.en === 'string' && definitionName.en.trim()) {
    return definitionName.en;
  }

  if (definitionName && typeof definitionName === 'object') {
    const firstStableName = Object.values(definitionName).find(
      (name) => typeof name === 'string' && name.trim(),
    );

    if (firstStableName) {
      return firstStableName;
    }
  }

  return localizedName;
}
