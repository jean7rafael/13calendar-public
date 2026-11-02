import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Auditoria de produção: mantém a trava de segurança sem trocar o parser de
// feriados por uma versão antiga que alteraria os cálculos do calendário.
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const audit = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['audit', '--omit=dev', '--json'],
  { cwd: projectRoot, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
)

if (audit.error || !audit.stdout.trim()) {
  console.error('Não foi possível executar a auditoria de produção.', audit.error)
  process.exit(1)
}

let report
try {
  report = JSON.parse(audit.stdout)
} catch {
  console.error('A auditoria de produção não devolveu JSON válido.')
  process.exit(1)
}

if (report.error || !report.vulnerabilities || !report.metadata?.vulnerabilities) {
  console.error('A auditoria de produção retornou um relatório incompleto.')
  process.exit(1)
}

// Exceção estreita: o parser atual herda um único aviso baixo de deepmerge.
// Qualquer outra dependência, gravidade ou aviso futuro interrompe a release.
const findings = Object.entries(report.vulnerabilities)
const allowed = findings.every(([name, finding]) => {
  if (finding.severity !== 'low' || finding.via?.length !== 1) return false
  if (name === 'deepmerge') {
    return finding.via[0]?.url ===
      'https://github.com/advisories/GHSA-gcqx-w48m-w2h4'
  }
  if (name === 'date-holidays-parser') {
    return finding.via[0] === 'deepmerge'
  }
  return false
})

if (!allowed || report.metadata.vulnerabilities.total !== findings.length) {
  console.error('A auditoria encontrou avisos de produção fora da exceção conhecida.')
  for (const [name, finding] of findings) {
    console.error(`- ${name}: ${finding.severity}`)
  }
  process.exit(1)
}

console.log(
  `Dependências de produção auditadas: ${findings.length} aviso(s) baixo(s) conhecido(s), nenhum outro.`,
)
