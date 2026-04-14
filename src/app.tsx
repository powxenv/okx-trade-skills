import SolarBag4BoldDuotone from '~icons/solar/bag-4-bold-duotone'
import SolarWadOfMoneyBoldDuotone from '~icons/solar/wad-of-money-bold-duotone'
import SolarPlanet2BoldDuotone from '~icons/solar/planet-2-bold-duotone'
import SolarChartBoldDuotone from '~icons/solar/chart-bold-duotone'
import SolarArchiveDownMinimlisticBoldDuotone from '~icons/solar/archive-down-minimlistic-bold-duotone'
import SolarCopyLineDuotone from '~icons/solar/copy-line-duotone'
import { Button, Tabs } from "@heroui/react";

function App() {
  return (
    <>
      <main className='min-h-lvh flex items-center'>
        <div className="inner">
          <div className="max-w-xl mx-auto text-center flex flex-col items-center">
            <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
              <SolarArchiveDownMinimlisticBoldDuotone className='text-zinc-500' />Diinstall 100+ kali
            </div>
            <h1 className="text-6xl mb-4 mt-2">Lorem ipsum dolor sit amet consectetur elit.</h1>
            <p className="max-w-md text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, ducimus rem perspiciatis officiis cumque at.</p>
          </div>

          <div className='flex justify-center'>
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
                      <span className='-tracking-wider font-medium'>Copy to your ai agents (any agents)</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200'>
                      Baca https://okxskills.netlify.app/AGENTS.md dan coba install OKX Trade Skills pada sistem kamu.
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
            <div className='rotate-8 -translate-y-20'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarWadOfMoneyBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quas.</p>
              </div>
            </div>

            <div className='-rotate-12'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarBag4BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quas.</p>
              </div>
            </div>

            <div className='rotate-6'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarPlanet2BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quas.</p>
              </div>
            </div>

            <div className='-rotate-4 -translate-y-10'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarChartBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe quas.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
