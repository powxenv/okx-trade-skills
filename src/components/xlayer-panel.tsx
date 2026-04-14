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

import xlayerSkill from '../../skills/okx-xlayer-agent/SKILL.md?raw'
import xlayerAgentAutomation from '../../skills/okx-xlayer-agent/references/agent-automation.md?raw'
import xlayerAuthentication from '../../skills/okx-xlayer-agent/references/authentication.md?raw'
import xlayerDecisionFramework from '../../skills/okx-xlayer-agent/references/decision-framework.md?raw'
import xlayerKeywordGlossary from '../../skills/okx-xlayer-agent/references/keyword-glossary.md?raw'
import xlayerRiskFramework from '../../skills/okx-xlayer-agent/references/risk-framework.md?raw'
import xlayerRiskManagement from '../../skills/okx-xlayer-agent/references/risk-management.md?raw'
import xlayerStrategies from '../../skills/okx-xlayer-agent/references/trading-strategies.md?raw'
import xlayerTroubleshooting from '../../skills/okx-xlayer-agent/references/troubleshooting.md?raw'
import xlayerUniswapIntegration from '../../skills/okx-xlayer-agent/references/uniswap-integration.md?raw'
import xlayerWorkflowBuy from '../../skills/okx-xlayer-agent/references/workflow-buy.md?raw'
import xlayerWorkflowSell from '../../skills/okx-xlayer-agent/references/workflow-sell.md?raw'
import xlayerWsMonitoring from '../../skills/okx-xlayer-agent/references/ws-monitoring.md?raw'
import xlayerXlayerStrategies from '../../skills/okx-xlayer-agent/references/xlayer-strategies.md?raw'
import xlayerChainSupport from '../../skills/okx-xlayer-agent/_shared/chain-support.md?raw'
import xlayerNativeTokens from '../../skills/okx-xlayer-agent/_shared/native-tokens.md?raw'
import xlayerPreflight from '../../skills/okx-xlayer-agent/_shared/preflight.md?raw'
import xlayerOpenai from '../../skills/okx-xlayer-agent/agents/openai.yaml?raw'

const files = [
  { id: 'xlayer-skill', filename: 'SKILL.md', content: xlayerSkill },
  { id: 'xlayer-ref-header', filename: 'references/', isHeader: true },
  { id: 'xlayer-agent-auto', filename: 'references/agent-automation.md', content: xlayerAgentAutomation },
  { id: 'xlayer-authentication', filename: 'references/authentication.md', content: xlayerAuthentication },
  { id: 'xlayer-decision', filename: 'references/decision-framework.md', content: xlayerDecisionFramework },
  { id: 'xlayer-keyword-glossary', filename: 'references/keyword-glossary.md', content: xlayerKeywordGlossary },
  { id: 'xlayer-risk-framework', filename: 'references/risk-framework.md', content: xlayerRiskFramework },
  { id: 'xlayer-risk-management', filename: 'references/risk-management.md', content: xlayerRiskManagement },
  { id: 'xlayer-strategies', filename: 'references/trading-strategies.md', content: xlayerStrategies },
  { id: 'xlayer-troubleshooting', filename: 'references/troubleshooting.md', content: xlayerTroubleshooting },
  { id: 'xlayer-uniswap-integration', filename: 'references/uniswap-integration.md', content: xlayerUniswapIntegration },
  { id: 'xlayer-workflow-buy', filename: 'references/workflow-buy.md', content: xlayerWorkflowBuy },
  { id: 'xlayer-workflow-sell', filename: 'references/workflow-sell.md', content: xlayerWorkflowSell },
  { id: 'xlayer-ws', filename: 'references/ws-monitoring.md', content: xlayerWsMonitoring },
  { id: 'xlayer-xlayer', filename: 'references/xlayer-strategies.md', content: xlayerXlayerStrategies },
  { id: 'xlayer-shared-header', filename: '_shared/', isHeader: true },
  { id: 'xlayer-chain-support', filename: '_shared/chain-support.md', content: xlayerChainSupport },
  { id: 'xlayer-native-tokens', filename: '_shared/native-tokens.md', content: xlayerNativeTokens },
  { id: 'xlayer-preflight', filename: '_shared/preflight.md', content: xlayerPreflight },
  { id: 'xlayer-agents-header', filename: 'agents/', isHeader: true },
  { id: 'xlayer-openai', filename: 'agents/openai.yaml', content: xlayerOpenai, isCode: true },
] satisfies FileEntry[]

export default function XlayerPanel() {
  return (
    <div>
      <aside>
        <Tabs orientation="vertical">
          <ScrollShadow className="max-h-165 max-w-75 w-full shrink-0">
            <Tabs.ListContainer>
              <Tabs.List aria-label="X Layer skill files" className='*:justify-start bg-transparent *:text-start w-full'>
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
