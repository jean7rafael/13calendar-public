import assert from 'node:assert/strict';
import merge from 'deepmerge';

// MARK: - Regressões de segurança do parser de feriados
// A versão local deve recusar chaves capazes de alterar protótipos, inclusive
// quando o alvo tem protótipo nulo ou um valor intermediário nulo.
const poisoned = JSON.parse('{"__proto__":{"admin":true},"constructor":{"prototype":{"admin":true}},"prototype":{"admin":true}}');
for (const target of [{}, Object.create(null), { session: null }]) {
  const result = merge(target, poisoned);
  assert.equal(Object.getPrototypeOf(result), Object.prototype);
  assert.equal(result.admin, undefined);
  assert.equal(Object.hasOwn(result, '__proto__'), false);
  assert.equal(Object.hasOwn(result, 'constructor'), false);
  assert.equal(Object.hasOwn(result, 'prototype'), false);
}

const nested = merge({ session: null }, JSON.parse('{"session":{"__proto__":{"admin":true},"name":"ok"}}'));
assert.equal(Object.getPrototypeOf(nested.session), Object.prototype);
assert.deepEqual(nested.session, { name: 'ok' });

// MARK: - Compatibilidade da API usada por date-holidays-parser
// Mesclas comuns, arrays e símbolos devem preservar o comportamento anterior.
const marker = Symbol('marker');
assert.deepEqual(merge({ country: { name: 'Brasil' }, days: [1] }, { country: { code: 'BR' }, days: [2] }), {
  country: { name: 'Brasil', code: 'BR' },
  days: [1, 2],
});
assert.deepEqual(merge.all([{ year: 2026 }, { month: 11 }, { day: 4 }]), {
  year: 2026,
  month: 11,
  day: 4,
});
assert.equal(merge({}, { [marker]: 'preservado' })[marker], 'preservado');

console.log('deepmerge local: proteção contra protótipos e compatibilidade básica verificadas.');
