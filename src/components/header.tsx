export default function Header() {
  return (
    <header className='fixed top-0 inset-x-0 py-6 bg-white/80 backdrop-blur-lg z-50'>
      <div className="inner flex items-center justify-between">
        <a href='/' className='flex items-center gap-2 font-medium -tracking-wider'>
          <img src='/okx.svg' alt='OKX' className='h-5' />
          Trade Skills
        </a>
        <nav className='flex items-center gap-6 text-sm text-zinc-600'>
          <a href='#guides'>Guides</a>
          <a href='#install'>Install</a>
          <a href='https://github.com/powxenv/okx-trade-skills' target='_blank' rel='noopener noreferrer'>GitHub</a>
        </nav>
      </div>
    </header>
  )
}
