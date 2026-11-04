'use strict';

// MARK: - Compatibilidade com deepmerge 4.3.1
// Esta cópia mínima mantém a API CommonJS usada por date-holidays-parser.
// O código original é MIT; a licença integral está no arquivo LICENSE.
function isMergeableObject(value) {
  if (!value || typeof value !== 'object') return false;
  const tag = Object.prototype.toString.call(value);
  if (tag === '[object RegExp]' || tag === '[object Date]') return false;
  const reactElement = typeof Symbol === 'function' && Symbol.for ? Symbol.for('react.element') : 0xeac7;
  return value.$$typeof !== reactElement;
}

function emptyTarget(value) {
  return Array.isArray(value) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, options) {
  return options.clone !== false && options.isMergeableObject(value)
    ? deepmerge(emptyTarget(value), value, options)
    : value;
}

function defaultArrayMerge(target, source, options) {
  return target.concat(source).map((item) => cloneUnlessOtherwiseSpecified(item, options));
}

function getMergeFunction(key, options) {
  if (!options.customMerge) return deepmerge;
  const customMerge = options.customMerge(key);
  return typeof customMerge === 'function' ? customMerge : deepmerge;
}

function getKeys(object) {
  const symbols = Object.getOwnPropertySymbols
    ? Object.getOwnPropertySymbols(object).filter((symbol) =>
        Object.propertyIsEnumerable.call(object, symbol),
      )
    : [];
  return Object.keys(object).concat(symbols);
}

// MARK: - Escrita segura de propriedades
// Nomes especiais nunca entram no resultado, inclusive quando o alvo tem
// protótipo nulo. A definição explícita impede acionar setters herdados.
function forbiddenKey(key) {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

function isUnsafeInheritedProperty(target, key) {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return false;
  }
  try {
    return key in target && !Object.propertyIsEnumerable.call(target, key);
  } catch {
    // Um Proxy que não permite inspeção não pode ser tratado como seguro.
    return true;
  }
}

function hasOwnEnumerableProperty(target, key) {
  return target !== null &&
    (typeof target === 'object' || typeof target === 'function') &&
    Object.propertyIsEnumerable.call(target, key);
}

function writeProperty(destination, key, value) {
  Object.defineProperty(destination, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function mergeObject(target, source, options) {
  const destination = {};
  if (options.isMergeableObject(target)) {
    getKeys(target).forEach((key) => {
      if (!forbiddenKey(key)) {
        writeProperty(destination, key, cloneUnlessOtherwiseSpecified(target[key], options));
      }
    });
  }
  getKeys(source).forEach((key) => {
    if (forbiddenKey(key) || isUnsafeInheritedProperty(target, key)) return;
    const value = hasOwnEnumerableProperty(target, key) && options.isMergeableObject(source[key])
      ? getMergeFunction(key, options)(target[key], source[key], options)
      : cloneUnlessOtherwiseSpecified(source[key], options);
    writeProperty(destination, key, value);
  });
  return destination;
}

// MARK: - API pública e opções de mesclagem
function deepmerge(target, source, options) {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;
  options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

  const sourceIsArray = Array.isArray(source);
  if (sourceIsArray !== Array.isArray(target)) {
    return cloneUnlessOtherwiseSpecified(source, options);
  }
  return sourceIsArray
    ? options.arrayMerge(target, source, options)
    : mergeObject(target, source, options);
}

deepmerge.all = function deepmergeAll(array, options) {
  if (!Array.isArray(array)) throw new Error('first argument should be an array');
  return array.reduce((previous, next) => deepmerge(previous, next, options), {});
};

module.exports = deepmerge;
