// Gera as ilustrações dos agentes em public/agents/<id>.svg.
// Rodar com: node scripts/generate-agent-art.mjs
// Todas compartilham a mesma "placa" (grade, anéis e núcleo); mudam só a cor da categoria e o símbolo.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CATEGORY_COLORS } from '../src/utils/catalog.js'

// Símbolos desenhados no centro do núcleo (200, 150), traço escuro sobre a cor.
const SYMBOLS = {
  'suporte-ao-cliente': `
    <path d="M170 160v-12a30 30 0 0 1 60 0v12" />
    <rect x="162" y="152" width="16" height="26" rx="6" />
    <rect x="222" y="152" width="16" height="26" rx="6" />
    <path d="M230 178c0 12-10 16-22 16h-6" />`,
  agendamentos: `
    <rect x="168" y="124" width="64" height="58" rx="9" />
    <path d="M168 144h64M186 116v16M214 116v16" />
    <path d="M186 162l9 9 18-18" />`,
  'redator-de-conteudo': `
    <path d="M176 186l6-24 38-38a9 9 0 0 1 13 13l-38 38z" />
    <path d="M212 132l13 13M200 186h32" />`,
  'analista-de-redes-sociais': `
    <path d="M166 186h68" />
    <path d="M178 176v-16M194 176v-32M210 176v-22M226 176v-44" />`,
  'revisor-de-codigo': `
    <path d="M186 128l-22 22 22 22M214 128l22 22-22 22M207 120l-14 60" />`,
  'gerador-de-testes': `
    <path d="M200 116l30 11v22c0 21-14 32-30 38-16-6-30-17-30-38v-22z" />
    <path d="M187 151l9 9 18-19" />`,
  'analista-de-planilhas': `
    <rect x="168" y="124" width="64" height="56" rx="7" />
    <path d="M168 143h64M168 161h64M190 124v56M211 124v56" />`,
  'gerador-de-relatorios': `
    <path d="M178 118h30l18 18v50h-48z" />
    <path d="M208 118v18h18M190 152h24M190 166h24M190 178h14" />`,
}

function buildSvg(color, symbol) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="60%">
      <stop offset="0" stop-color="${color}" stop-opacity="0.32" />
      <stop offset="1" stop-color="${color}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="shine" cx="38%" cy="32%" r="70%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="1.2" fill="${color}" fill-opacity="0.22" />
    </pattern>
  </defs>
  <rect width="400" height="300" fill="#0B0F29" />
  <rect width="400" height="300" fill="url(#dots)" />
  <rect width="400" height="300" fill="url(#glow)" />
  <g fill="none" stroke="${color}" stroke-linecap="round">
    <circle cx="200" cy="150" r="104" stroke-opacity="0.18" stroke-width="1.5" />
    <circle cx="200" cy="150" r="80" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="3 11" />
    <path d="M24 48V24h24M352 24h24v24M376 252v24h-24M48 276H24v-24" stroke-opacity="0.45" stroke-width="2" />
  </g>
  <circle cx="200" cy="150" r="54" fill="${color}" />
  <circle cx="200" cy="150" r="54" fill="url(#shine)" />
  <g fill="none" stroke="#0E1230" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${symbol}
  </g>
</svg>
`
}

const agents = JSON.parse(readFileSync(new URL('../src/data/agents.json', import.meta.url), 'utf8'))

const outDir = new URL('../public/agents/', import.meta.url)
mkdirSync(outDir, { recursive: true })

for (const agent of agents) {
  const svg = buildSvg(CATEGORY_COLORS[agent.category], SYMBOLS[agent.id])
  writeFileSync(new URL(`${agent.id}.svg`, outDir), svg)
  console.log(`gerado: public/agents/${agent.id}.svg`)
}
