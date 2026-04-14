import { ScrollShadow, Tabs } from "@heroui/react";
import SolarFileLineDuotone from '~icons/solar/file-line-duotone'
import SolarCodeFileLineDuotone from '~icons/solar/code-file-line-duotone'
import FilePanel from './file-panel'

interface FileEntry {
  id: string
  filename: string
  content?: string
  isHeader?: boolean
  isCode?: boolean
}

import uniswapSkill from '../../skills/okx-uniswap/SKILL.md?raw'
import uniswapAgentPatterns from '../../skills/okx-uniswap/references/agent-uniswap-patterns.md?raw'
import uniswapKeywordGlossary from '../../skills/okx-uniswap/references/keyword-glossary.md?raw'
import uniswapLiquidityMgmt from '../../skills/okx-uniswap/references/liquidity-management.md?raw'
import uniswapRiskManagement from '../../skills/okx-uniswap/references/risk-management.md?raw'
import uniswapStrategies from '../../skills/okx-uniswap/references/trading-strategies.md?raw'
import uniswapTradingApi from '../../skills/okx-uniswap/references/trading-api.md?raw'
import uniswapX402Payments from '../../skills/okx-uniswap/references/x402-payments.md?raw'
import uniswapXlayerStrategies from '../../skills/okx-uniswap/references/xlayer-strategies.md?raw'
import uniswapChainSupport from '../../skills/okx-uniswap/_shared/chain-support.md?raw'
import uniswapNativeTokens from '../../skills/okx-uniswap/_shared/native-tokens.md?raw'
import uniswapPreflight from '../../skills/okx-uniswap/_shared/preflight.md?raw'
import uniswapOpenai from '../../skills/okx-uniswap/agents/openai.yaml?raw'

const files = [
  { id: 'uniswap-skill', filename: 'SKILL.md', content: uniswapSkill },
  { id: 'uniswap-ref-header', filename: 'references/', isHeader: true },
  { id: 'uniswap-patterns', filename: 'references/agent-uniswap-patterns.md', content: uniswapAgentPatterns },
  { id: 'uniswap-keyword-glossary', filename: 'references/keyword-glossary.md', content: uniswapKeywordGlossary },
  { id: 'uniswap-liquidity', filename: 'references/liquidity-management.md', content: uniswapLiquidityMgmt },
  { id: 'uniswap-risk-mgmt', filename: 'references/risk-management.md', content: uniswapRiskManagement },
  { id: 'uniswap-strategies', filename: 'references/trading-strategies.md', content: uniswapStrategies },
  { id: 'uniswap-trading-api', filename: 'references/trading-api.md', content: uniswapTradingApi },
  { id: 'uniswap-xlayer', filename: 'references/xlayer-strategies.md', content: uniswapXlayerStrategies },
  { id: 'uniswap-payments', filename: 'references/x402-payments.md', content: uniswapX402Payments },
  { id: 'uniswap-shared-header', filename: '_shared/', isHeader: true },
  { id: 'uniswap-chain-support', filename: '_shared/chain-support.md', content: uniswapChainSupport },
  { id: 'uniswap-native-tokens', filename: '_shared/native-tokens.md', content: uniswapNativeTokens },
  { id: 'uniswap-preflight', filename: '_shared/preflight.md', content: uniswapPreflight },
  { id: 'uniswap-agents-header', filename: 'agents/', isHeader: true },
  { id: 'uniswap-openai', filename: 'agents/openai.yaml', content: uniswapOpenai, isCode: true },
] satisfies FileEntry[]

export default function UniswapPanel() {
  return (
    <div>
      <aside>
        <Tabs orientation="vertical">
          <ScrollShadow className="max-h-165 max-w-75 w-full shrink-0">
            <Tabs.ListContainer>
              <Tabs.List aria-label="Uniswap skill files" className='*:justify-start bg-transparent *:text-start w-full'>
                {files.map((file) =>
                  file.isHeader ? (
                    <Tabs.Tab key={file.id} id={file.id} isDisabled className='opacity-100 text-zinc-500'>
                      {file.filename}
                      <Tabs.Indicator className='bg-muted/6 shadow-none' />
                    </Tabs.Tab>
                  ) : (
                    <Tabs.Tab key={file.id} id={file.id}>
                      {file.isCode ? <SolarCodeFileLineDuotone className='size-4 mr-1' /> : <SolarFileLineDuotone className='size-4 mr-1' />}
                      {file.filename.split('/').pop()}
                      <Tabs.Indicator className='bg-muted/6 shadow-none' />
                    </Tabs.Tab>
                  )
                )}
              </Tabs.List>
            </Tabs.ListContainer>
          </ScrollShadow>

          {files.map((file) =>
            !file.isHeader && (
              <Tabs.Panel key={file.id} className="px-4" id={file.id}>
                <FilePanel filename={file.filename} content={file.content} />
              </Tabs.Panel>
            )
          )}
        </Tabs>
      </aside>
    </div>
  )
}
