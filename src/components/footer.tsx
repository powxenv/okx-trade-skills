export default function Footer() {
  return (
    <footer className='py-6'>
      <div className="inner flex items-center justify-between text-sm text-zinc-500">
        <a href='/' className='flex items-center gap-2'>
          <img src='/okx.svg' alt='OKX' className='h-4' />
          Trade Skills
        </a>
        <span>Built for onchain traders who use AI agents.</span>
      </div>
    </footer>
  )
}
