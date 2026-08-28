import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const checkpointPath = resolve(projectRoot, '.codex-work-checkpoint.md')
const protocolPath = resolve(projectRoot, 'docs/WORK_CONTINUITY_PROTOCOL.md')

const listOptions = new Map([
  ['--completed', 'completed'],
  ['--decision', 'decisions'],
  ['--blocker', 'blockers'],
  ['--verification', 'verifications'],
])

const scalarOptions = new Map([
  ['--objective', 'objective'],
  ['--phase', 'phase'],
  ['--next', 'nextAction'],
  ['--note', 'notes'],
])

const sectionNames = {
  objective: 'Objetivo atual',
  phase: 'Etapa em andamento',
  completed: 'Concluído nesta frente',
  decisions: 'Decisões que não podem ser perdidas',
  nextAction: 'Próxima ação exata',
  blockers: 'Bloqueios externos',
  verifications: 'Verificações já executadas',
  notes: 'Observações de retomada',
}

function fail(message) {
  console.error(`Falha no checkpoint: ${message}`)
  process.exitCode = 1
}

function git(...args) {
  try {
    return execFileSync('git', args, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  } catch {
    return 'indisponível'
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function readSection(markdown, name) {
  const pattern = new RegExp(
    `(?:^|\\n)## ${escapeRegExp(name)}\\n([\\s\\S]*?)(?=\\n## |$)`,
  )
  return markdown.match(pattern)?.[1].trim() ?? ''
}

function readList(markdown, name) {
  return readSection(markdown, name)
    .split('\n')
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean)
}

function parseCheckpointMarkdown(markdown) {
  return {
    objective: readSection(markdown, sectionNames.objective),
    phase: readSection(markdown, sectionNames.phase),
    completed: readList(markdown, sectionNames.completed),
    decisions: readList(markdown, sectionNames.decisions),
    nextAction: readSection(markdown, sectionNames.nextAction),
    blockers: readList(markdown, sectionNames.blockers),
    verifications: readList(markdown, sectionNames.verifications),
    notes: readSection(markdown, sectionNames.notes),
  }
}

function readPreviousCheckpoint() {
  if (!existsSync(checkpointPath)) {
    return {
      objective: '',
      phase: '',
      completed: [],
      decisions: [],
      nextAction: '',
      blockers: [],
      verifications: [],
      notes: '',
    }
  }

  return parseCheckpointMarkdown(readFileSync(checkpointPath, 'utf8'))
}

function parseArguments(args) {
  const result = {
    mode: 'update',
    scalar: {},
    lists: {},
    hasUpdates: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--show' || argument === '--clear' || argument === '--audit') {
      result.mode = argument.slice(2)
      continue
    }

    const scalarKey = scalarOptions.get(argument)
    const listKey = listOptions.get(argument)
    if (!scalarKey && !listKey) {
      throw new Error(`opção desconhecida: ${argument}`)
    }

    const value = args[index + 1]?.trim()
    if (!value || value.startsWith('--')) {
      throw new Error(`a opção ${argument} precisa de um texto`)
    }

    index += 1
    result.hasUpdates = true
    if (scalarKey) {
      result.scalar[scalarKey] = value
    } else {
      result.lists[listKey] ??= []
      result.lists[listKey].push(value)
    }
  }

  return result
}

function renderList(items, fallback = 'Nenhum registrado.') {
  const values = items.length > 0 ? items : [fallback]
  return values.map((item) => `- ${item}`).join('\n')
}

function renderCheckpoint(state) {
  const updatedAt = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date())
  const branch = git('branch', '--show-current') || 'HEAD destacado'
  const lastCommit = git('log', '-1', '--pretty=format:%h %s')
  const status = git('status', '--short') || 'Árvore de trabalho limpa.'
  const unstagedStat = git('diff', '--stat') || 'Nenhuma alteração não preparada.'
  const stagedStat = git('diff', '--cached', '--stat') || 'Nenhuma alteração preparada.'

  return `# Checkpoint vivo do trabalho

> Arquivo local gerado automaticamente. Leia-o depois de
> \`docs/PROJECT_CONTEXT.md\` e confirme o retrato com o Git antes de agir.

**Atualizado:** ${updatedAt}
**Branch:** \`${branch}\`
**Último commit:** ${lastCommit}

## ${sectionNames.objective}

${state.objective || 'Não informado.'}

## ${sectionNames.phase}

${state.phase || 'Não informada.'}

## ${sectionNames.completed}

${renderList(state.completed)}

## ${sectionNames.decisions}

${renderList(state.decisions)}

## ${sectionNames.nextAction}

${state.nextAction || 'Não informada.'}

## ${sectionNames.blockers}

${renderList(state.blockers)}

## ${sectionNames.verifications}

${renderList(state.verifications)}

## ${sectionNames.notes}

${state.notes || 'Nenhuma.'}

## Retrato automático do repositório

### Estado dos arquivos

\`\`\`text
${status}
\`\`\`

### Alterações preparadas

\`\`\`text
${stagedStat}
\`\`\`

### Alterações ainda não preparadas

\`\`\`text
${unstagedStat}
\`\`\`
`
}

function auditProtocol() {
  const agentsPath = resolve(projectRoot, 'AGENTS.md')
  const isPublicRelease =
    process.env.GITHUB_REPOSITORY === 'jean7rafael/13calendar-public'

  /* AGENTS.md contém instruções internas e é excluído deliberadamente do
     espelho público. A fonte privada já executa esta auditoria antes de
     sincronizar; no CI público, a ausência conhecida não deve invalidar o
     restante da mesma revisão. */
  if (!existsSync(agentsPath) && isPublicRelease) {
    console.log('✓ protocolo de continuidade validado na fonte privada antes do espelhamento')
    return
  }

  const agents = readFileSync(agentsPath, 'utf8')
  const gitignore = readFileSync(resolve(projectRoot, '.gitignore'), 'utf8')
  const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'))
  const protocol = existsSync(protocolPath) ? readFileSync(protocolPath, 'utf8') : ''
  const scripts = packageJson.scripts ?? {}
  const roundTripSource = {
    objective: 'Objetivo de teste',
    phase: 'Etapa de teste',
    completed: ['Marco de teste'],
    decisions: ['Decisão de teste'],
    nextAction: 'Editar arquivo de teste e executar a verificação.',
    blockers: ['Nenhum'],
    verifications: ['Auditoria de teste'],
    notes: 'Observação de teste',
  }
  const roundTripResult = parseCheckpointMarkdown(renderCheckpoint(roundTripSource))
  const preservesRoundTrip = Object.entries(roundTripSource).every(([key, value]) =>
    Array.isArray(value)
      ? JSON.stringify(roundTripResult[key]) === JSON.stringify(value)
      : roundTripResult[key] === value,
  )
  const activeCheckpoint = existsSync(checkpointPath)
    ? parseCheckpointMarkdown(readFileSync(checkpointPath, 'utf8'))
    : null

  const checks = [
    [agents.includes('.codex-work-checkpoint.md'), 'AGENTS.md exige a leitura do checkpoint'],
    [agents.includes('próxima ação deve ser executável'), 'AGENTS.md exige uma próxima ação executável'],
    [gitignore.includes('/.codex-work-checkpoint.md'), 'o checkpoint vivo está ignorado pelo Git'],
    [protocol.includes('## Ordem de retomada'), 'o protocolo documenta a ordem de retomada'],
    [scripts.checkpoint?.includes('manageWorkCheckpoint.mjs'), 'o comando de checkpoint está disponível'],
    [scripts['checkpoint:show']?.includes('--show'), 'o comando de leitura está disponível'],
    [scripts['checkpoint:clear']?.includes('--clear'), 'o comando de encerramento está disponível'],
    [scripts.verify?.includes('continuity:audit'), 'a verificação integral protege o protocolo'],
    [preservesRoundTrip, 'os campos sobrevivem à gravação e à leitura do checkpoint'],
    [
      !activeCheckpoint || Boolean(activeCheckpoint.objective && activeCheckpoint.nextAction),
      'o checkpoint ativo contém objetivo e próxima ação',
    ],
  ]

  const failedChecks = checks.filter(([passed]) => !passed)
  if (failedChecks.length > 0) {
    for (const [, description] of failedChecks) {
      console.error(`✗ ${description}`)
    }
    fail(`${failedChecks.length} regra(s) de continuidade ausente(s)`)
    return
  }

  for (const [, description] of checks) {
    console.log(`✓ ${description}`)
  }
  console.log('Protocolo de continuidade aprovado.')
}

let parsed
try {
  parsed = parseArguments(process.argv.slice(2))
} catch (error) {
  fail(error.message)
}

if (parsed) {
  if (parsed.mode === 'show') {
    if (!existsSync(checkpointPath)) {
      fail('nenhum checkpoint ativo foi encontrado')
    } else {
      process.stdout.write(readFileSync(checkpointPath, 'utf8'))
    }
  } else if (parsed.mode === 'clear') {
    if (existsSync(checkpointPath)) {
      unlinkSync(checkpointPath)
      console.log('Checkpoint ativo removido depois da conclusão da frente.')
    } else {
      console.log('Nenhum checkpoint ativo para remover.')
    }
  } else if (parsed.mode === 'audit') {
    auditProtocol()
  } else if (!parsed.hasUpdates && !existsSync(checkpointPath)) {
    fail('informe ao menos --objective e --next para iniciar uma nova frente')
  } else {
    const previous = readPreviousCheckpoint()
    const state = {
      ...previous,
      ...parsed.scalar,
      ...parsed.lists,
    }

    if (!state.objective || !state.nextAction) {
      fail('um checkpoint ativo precisa de objetivo e próxima ação exata')
    } else {
      writeFileSync(checkpointPath, renderCheckpoint(state), 'utf8')
      console.log(`Checkpoint atualizado em ${checkpointPath}`)
    }
  }
}
