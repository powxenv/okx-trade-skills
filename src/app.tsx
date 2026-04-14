import SolarBag4BoldDuotone from '~icons/solar/bag-4-bold-duotone'
import SolarWadOfMoneyBoldDuotone from '~icons/solar/wad-of-money-bold-duotone'
import SolarPlanet2BoldDuotone from '~icons/solar/planet-2-bold-duotone'
import SolarChartBoldDuotone from '~icons/solar/chart-bold-duotone'
import SolarArchiveDownMinimlisticBoldDuotone from '~icons/solar/archive-down-minimlistic-bold-duotone'
import SolarCopyLineDuotone from '~icons/solar/copy-line-duotone'
import { Button, ScrollShadow, Tabs } from "@heroui/react";
import SolarDocumentsBoldDuotone from '~icons/solar/documents-bold-duotone'
import SolarFileLineDuotone from '~icons/solar/file-line-duotone'
import SolarCodeFileLineDuotone from '~icons/solar/code-file-line-duotone'

function App() {
  return (
    <>
      <main className='min-h-lvh flex items-center py-18'>
        <div className="inner">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
              <SolarArchiveDownMinimlisticBoldDuotone className='text-zinc-500' />Installed 100+ times
            </div>
            <h1 className="text-6xl mb-6 mt-4">Trade onchain with AI agents that actually work</h1>
            <p className="max-w-xl text-xl text-zinc-600">A skill library for autonomous trading. Research tokens, scan for honeypots, execute swaps, track smart money, and run DeFi strategies across EVM chains and Solana.</p>
          </div>

          <div className='flex justify-center mt-8'>
            <Tabs className="w-full max-w-md">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="overview">
                    Copy Prompt
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="analytics">
                    Use Flins
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="reports">
                    Use skills.sh
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="overview" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your AI agents (any agent)</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200'>
                      Read https://okxskills.netlify.app/AGENTS.md and install OKX Trade Skills on your system.
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="analytics" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your terminal</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm'>
                      npx flins@latest add powxenv/okx-trade-skills
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="reports" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your terminal</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm'>
                      npx skills@latest add powxenv/okx-trade-skills
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className='rotate-2 -translate-y-20'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarWadOfMoneyBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Execute swaps with safety built in</h3>
                <p>Get price quotes across 500+ DEXes, run honeypot scans before every trade, and execute with slippage protection and MEV defense.</p>
              </div>
            </div>

            <div className='-rotate-10'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarBag4BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Run autonomous trading agents</h3>
                <p>Deploy self-managing bots that follow smart money signals, rebalance portfolios, and compound DeFi yields. Manual, semi-auto, or full-auto modes.</p>
              </div>
            </div>

            <div className='rotate-6'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarPlanet2BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Stake, lend, and provide liquidity</h3>
                <p>Access DeFi protocols across chains. Deposit into yield farms, manage V3 LP positions, and auto-compound rewards with gas-optimized rebalancing.</p>
              </div>
            </div>

            <div className='-rotate-4 -translate-y-10'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarChartBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Research before you trade</h3>
                <p>Analyze token metrics, track whale and KOL wallets, monitor trending memes, and get real-time PnL analytics. Data-driven decisions only.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className='py-28'>
        <div className="inner">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
              <SolarDocumentsBoldDuotone className='text-zinc-500' /> 50+ Guides For Your Agents
            </div>
            <h1 className="text-6xl mb-6 mt-4">Semua yang kamu butuhkan tersedia</h1>
            <p className="max-w-xl text-xl text-zinc-600">Explore skills dan reference yang ada di OKX trading skills yang lengkap termasuk risk management dan lainnya</p>
          </div>

          <div className='mt-8'>
            <Tabs>
              <Tabs.ListContainer className="w-full max-w-xl mx-auto">
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="overview">
                    OKX Trading Skill
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="analytics">
                    OKX Uniswap Skill
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="reports">
                    OKX X Layer Agent
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="overview">
                <div>
                  <aside>
                    <Tabs orientation="vertical">
                      <Tabs.ListContainer className='max-w-[260px] w-full'>
                        <Tabs.List aria-label="Vertical tabs" className='*:justify-start bg-transparent *:text-start w-full'>
                          <Tabs.Tab id="account">
                            <SolarFileLineDuotone className='size-4 mr-1' />
                            SKILL.md
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                          <Tabs.Tab id="asdasd" isDisabled className='opacity-100 text-zinc-600'>
                            References
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                          <Tabs.Tab id="security">
                            <SolarFileLineDuotone className='size-4 mr-1' />
                            agent-uniswap-patterns.md
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                          <Tabs.Tab id="notifications">
                            <SolarFileLineDuotone className='size-4 mr-1' />
                            keyword-glossary.md
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                          <Tabs.Tab id="akjsndakjds" isDisabled className='opacity-100 text-zinc-600'>
                            Shared
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                          <Tabs.Tab id="asd">
                            <SolarFileLineDuotone className='size-4 mr-1' />
                            chain-support.md
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                          <Tabs.Tab id="asdkjnaksd" isDisabled className='opacity-100 text-zinc-600'>
                            Config Khusus Agent
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                          <Tabs.Tab id="billing">
                            <SolarCodeFileLineDuotone className='size-4 mr-1' />
                            openai.yaml
                            <Tabs.Indicator className='bg-muted/6 shadow-none' />
                          </Tabs.Tab>
                        </Tabs.List>
                      </Tabs.ListContainer>
                      <Tabs.Panel className="px-4" id="account">
                        <div className='border rounded-2xl p-1'>
                          <div className='bg-zinc-100 rounded-xl'>
                            <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                              <span className='-tracking-wider font-medium'>SKILL.md</span>
                              <Button isIconOnly size='sm' variant="ghost">
                                <SolarCopyLineDuotone />
                              </Button>
                            </div>
                            <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono'>
                              Read https://okxskills.netlify.app/AGENTS.md and install OKX Trade Skills on your system.
                            </div>
                          </div>
                        </div>
                      </Tabs.Panel>
                      <Tabs.Panel className="px-4" id="security">
                        <div className='border rounded-2xl p-1'>
                          <div className='bg-zinc-100 rounded-xl'>
                            <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                              <span className='-tracking-wider font-medium'>references/agent-uniswap-patterns.md</span>
                              <Button isIconOnly size='sm' variant="ghost">
                                <SolarCopyLineDuotone />
                              </Button>
                            </div>
                            <ScrollShadow isEnabled={false} className="max-h-[600px] bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono">
                              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea praesentium natus debitis maiores quidem velit quaerat facere, dignissimos sapiente totam perspiciatis repellendus enim pariatur, nemo molestias commodi laboriosam optio nam voluptates asperiores? Explicabo ut non nobis libero, voluptatibus in cupiditate, laboriosam itaque tempora, obcaecati distinctio! Quibusdam vitae natus dolorem in, id ducimus iure esse deleniti, at deserunt ullam velit temporibus error? Fugiat possimus recusandae maiores ducimus est neque aspernatur adipisci, sint fuga id aliquid minus! Quas consectetur voluptate optio, magnam laboriosam excepturi sunt molestiae distinctio deserunt veniam quis corporis provident iste, placeat numquam ea aspernatur harum ut dolore est accusamus mollitia esse soluta nesciunt. Totam, ea accusamus, temporibus fugiat, quam exercitationem praesentium velit mollitia officiis est libero neque quos ab nihil voluptates itaque. Est autem sunt officiis, praesentium consequuntur facere qui accusamus tenetur enim. Illo explicabo voluptas aperiam. Ea, facilis ut nemo possimus iste ducimus in natus, aliquam, vitae suscipit molestiae sunt ex error velit illo? Ducimus sit debitis excepturi, sint consequuntur dolore asperiores possimus unde, libero, velit exercitationem! Accusamus suscipit, possimus repellendus explicabo iste dolorem recusandae voluptatem consectetur rem exercitationem accusantium laborum harum maxime earum facere numquam. Eos fugit ipsa natus, fuga velit nemo eaque voluptatibus sunt perferendis officia veritatis dolorum praesentium reprehenderit sed sapiente est tempora quia, dolor temporibus aliquid mollitia nobis? Possimus distinctio, aut sunt eos pariatur cumque iure voluptate totam voluptatem autem natus sit harum ad sequi veniam dolore ut assumenda nisi id quam? Officiis autem explicabo facere blanditiis rem odio natus mollitia debitis accusantium quos dolores vitae, harum sapiente laudantium ut consequatur perferendis voluptatibus corporis ipsum. Aperiam libero consectetur eligendi blanditiis natus, officiis enim commodi ad impedit ipsam illum optio, sint qui. Quidem ducimus repellendus aspernatur dolore expedita a ullam iure itaque mollitia velit magnam, voluptates nisi quaerat eos sed assumenda? Veritatis repellendus omnis excepturi nam tempora illum explicabo adipisci? Odit delectus soluta alias ullam modi laborum omnis eveniet molestiae nulla voluptatem voluptatum doloribus quod consequatur sit doloremque in sint eaque excepturi tempore, officia illo? Officia praesentium explicabo minus! Expedita itaque omnis unde incidunt facilis veniam ratione fuga nesciunt molestiae. Aut corrupti at hic praesentium optio reprehenderit accusamus itaque commodi. Ad vitae atque quibusdam et corporis impedit quia ducimus provident assumenda nemo repellat sit dicta, temporibus illum eos unde adipisci! Inventore iste alias, modi minima laboriosam, ullam eos harum itaque voluptatum deserunt quis saepe vero adipisci totam culpa distinctio illum, neque cum natus. Adipisci optio unde ipsam minima fugiat explicabo quidem laudantium debitis, quo maxime corporis facere ipsa est! Itaque, nisi. Odio temporibus incidunt animi adipisci dolor ipsa reprehenderit ea quas tempora. Quis sit fuga obcaecati eum assumenda dolor vel esse praesentium repellat amet exercitationem, cum eaque aspernatur qui saepe, officiis quae, pariatur nisi! Iure doloribus mollitia expedita sint nostrum aspernatur cupiditate ullam repellat ex nisi fuga perspiciatis culpa eos accusamus, ipsa illum non quam modi dolorem repudiandae, fugit voluptatum! Quod neque excepturi impedit. Fugiat ratione libero eaque officiis facere qui id doloremque adipisci! Numquam magni aliquid, veritatis iusto ratione vel molestias libero voluptates facilis dolorem enim, voluptatibus molestiae unde omnis, rem eos! Magnam veritatis provident quidem quo temporibus veniam, reiciendis hic doloremque. Vitae debitis delectus fugiat! Hic, enim distinctio aut suscipit architecto qui voluptates debitis magnam dolore doloremque repudiandae? Quo aliquid, in explicabo nam recusandae odio blanditiis necessitatibus assumenda soluta deserunt iusto doloremque voluptas provident quaerat fugit, fugiat eius. Expedita neque vel ullam aspernatur a quo delectus velit accusantium! Eaque eius at cum culpa delectus. Molestiae perferendis magni, aut modi, nam iste vero dolorem libero labore reiciendis eos fugit illo sint. Dolor itaque magni quas asperiores mollitia, inventore velit laudantium alias totam repellat nisi dicta quidem id culpa? Perspiciatis blanditiis iure at consequuntur aspernatur debitis iusto temporibus molestias commodi sit illum perferendis esse veritatis consequatur recusandae ipsam nobis autem minima ut, laborum doloremque vero hic. Magnam totam fugiat reiciendis ratione qui temporibus non dolorem debitis unde quis pariatur error quo dolore obcaecati eveniet voluptate adipisci, quasi tempore. Dignissimos nesciunt nam quos voluptatum? Nesciunt esse eligendi quibusdam est vitae eum nihil, enim dolorem nisi beatae fugit id? Vitae quam aliquam libero harum maiores quaerat ratione, quos sit enim nemo error at ea beatae, velit quisquam officiis dignissimos nisi veniam illo nesciunt dolor consectetur repellendus tempora doloribus? Reiciendis accusamus corrupti officiis sapiente qui laboriosam a, sint, quaerat tempore nostrum totam vitae rerum dolores quae voluptatum maiores eos ut veritatis, molestias porro optio iste molestiae! Dignissimos similique nam quia quae debitis soluta voluptates suscipit ex sunt nostrum omnis quidem cumque est praesentium nemo aspernatur veritatis, libero fugit perferendis optio et. Officia sequi voluptate nisi id ut aspernatur, libero, sapiente unde exercitationem hic numquam quia, nam iusto dolore repudiandae accusamus neque recusandae alias impedit nesciunt? Temporibus adipisci corporis consectetur veritatis molestiae illo reiciendis dolores rem hic sunt ipsum quaerat numquam impedit error, deserunt eveniet praesentium earum et animi provident, velit amet, ex perspiciatis. Omnis eum nam minus tempora aut veritatis reprehenderit iure itaque aperiam eaque autem suscipit illo, fugiat rem accusamus totam, natus ducimus quis labore perferendis. Optio doloremque modi, iure placeat suscipit asperiores omnis a dolorem autem. Ab quaerat, maxime commodi odio pariatur aut neque nesciunt adipisci debitis facilis voluptatum optio, vero sapiente nostrum velit obcaecati odit molestias tempora recusandae numquam dignissimos! Vitae impedit ad a sapiente illum sunt enim pariatur, nam adipisci iusto cumque ducimus corporis. Labore architecto, voluptate veniam facilis reiciendis quisquam eaque! Excepturi officiis nihil quo aperiam perferendis rerum quia, eligendi totam ipsam corporis asperiores molestias ipsa iste nisi culpa eos aspernatur voluptatem? In blanditiis quasi corporis cum delectus nemo. Tempore blanditiis, perspiciatis autem ut saepe architecto exercitationem magni impedit similique porro aperiam illum sit enim dolorem rerum ab ipsam fugit in rem. Dolorum, nam pariatur? Magnam facilis aspernatur vitae temporibus explicabo corporis, illo, suscipit illum ea labore deserunt possimus magni sapiente voluptas ipsum incidunt veritatis ratione. Sequi molestias ex consequatur temporibus odio quas sapiente iure rem aperiam recusandae explicabo iste voluptatum delectus, dolores nulla error? Sapiente vero voluptatibus corrupti repellendus nulla cumque nostrum hic, iste libero, mollitia, nobis saepe tempore ullam illo fugit!
                            </ScrollShadow>
                          </div>
                        </div>
                      </Tabs.Panel>
                      <Tabs.Panel className="px-4" id="notifications">
                        <h3 className="mb-2 font-semibold">Notification Preferences</h3>
                        <p className="text-sm text-muted">Choose how and when you want to receive notifications.</p>
                      </Tabs.Panel>
                      <Tabs.Panel className="px-4" id="billing">
                        <h3 className="mb-2 font-semibold">Billing Information</h3>
                        <p className="text-sm text-muted">View and manage your subscription and payment methods.</p>
                      </Tabs.Panel>
                      <Tabs.Panel className="px-4" id="asd">
                        <h3 className="mb-2 font-semibold">Chain Support</h3>
                        <p className="text-sm text-muted">View and manage your subscription and payment methods.</p>
                      </Tabs.Panel>
                    </Tabs>
                  </aside>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="analytics">
                <p>Track your metrics and analyze performance data.</p>
              </Tabs.Panel>
              <Tabs.Panel id="reports">
                <p>Generate and download detailed reports.</p>
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
