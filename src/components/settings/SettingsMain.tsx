import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import transactionHistory from '../../assets/figma/settings/transaction-history.svg'
import ContactSheet from './ContactSheet'
import { ChevronLeft, ChevronRight, FaqIcon, MailIcon, ShieldIcon, SignInIcon, SignOutIcon, TermsIcon, TransactionsIcon } from './icons'
import SettingsRow from './SettingsRow'

const back = (navigate: ReturnType<typeof useNavigate>) => () => (window.history.length > 1 ? navigate(-1) : navigate('/'))

function Footer() {
  return (
    <div className="pt-[16px] text-center">
      <div className="text-[10px] leading-[15px] font-bold tracking-[0.5px] text-[#a3a3a3]">TRIPKET PH · V2.0.3</div>
      <div className="mt-[4px] text-[9px] leading-[13.5px] font-bold tracking-[0.9px] text-[#d4d4d4] uppercase">Philippine Ferry Booking</div>
    </div>
  )
}

// ---- Guest: live app (book.tripket.ph/account) ----
function Guest({ onContact }: { onContact: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="relative mx-auto min-h-dvh max-w-lg bg-white pb-[112px] select-none">
      <div className="flex flex-col gap-[24px] p-[24px]">
        <header className="mt-[8px] flex items-center gap-[8px] pb-[8px]">
          <button type="button" aria-label="Back" onClick={back(navigate)} className="flex size-[40px] items-center justify-center rounded-full border border-[#f1f5f9] bg-white text-[#334155] transition-all">
            <ChevronLeft />
          </button>
          <h2 className="text-[28px] leading-[32.2px] font-medium tracking-[-0.7px] text-text-primary">Settings</h2>
        </header>

        <div className="flex items-center gap-[16px] overflow-hidden rounded-12 border border-[#f1f5f9] bg-[#f1f5f9] p-[16px]">
          <div className="flex size-[48px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#fb923c] to-[#ea580c] text-white uppercase shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">U</div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[14px] leading-[20px] font-bold text-text-primary">Guest User</h2>
            <p className="mt-[2px] text-[12px] leading-[16px] text-[#a3a3a3]">Sign in to save details on this device</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#ebe8e8] px-[10px] py-[4px] text-[10px] leading-[15px] font-bold text-[#8e8e93] uppercase">Guest</span>
        </div>

        <div className="overflow-hidden rounded-12 border border-[#f1f5f9] bg-white p-[4px]">
          <SettingsRow icon={<TransactionsIcon />} title="Transactions" subtitle="Payment & points history" onClick={() => navigate('/tickets')} />
        </div>

        <div className="divide-y divide-[#f1f5f9] overflow-hidden rounded-[24px] border border-[#f5f5f5] bg-white p-[4px]">
          <SettingsRow icon={<FaqIcon />} title="FAQs" subtitle="Common questions" onClick={() => navigate('/account/faqs')} />
          <SettingsRow icon={<ShieldIcon />} title="Privacy Policy" subtitle="How we handle data" onClick={() => navigate('/privacy')} />
          <SettingsRow icon={<TermsIcon />} title="Terms of Service" subtitle="Usage terms" onClick={() => navigate('/terms')} />
          <SettingsRow icon={<MailIcon />} title="Contact Support" subtitle="Get help" onClick={onContact} />
        </div>

        <div className="overflow-hidden rounded-16 border border-[#f5f5f5] p-[4px]">
          <SettingsRow icon={<SignInIcon />} title="Sign in" subtitle="Sign in to your account" onClick={() => navigate('/login', { state: { from: '/account' } })} />
        </div>

        <Footer />
      </div>
    </div>
  )
}

// ---- Signed in: Figma "Settings" (11598:35161) ----
function FigmaRow({ icon, title, subtitle, onClick, className = '' }: { icon: ReactNode; title: string; subtitle: string; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-[73px] w-full items-center gap-[16px] px-[16px] text-left ${className}`}>
      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#e5e5ea] to-[#d1d1d6] text-[#7b797b]">{icon}</span>
      <span className="flex-1">
        <span className="block text-[15px] leading-[22.5px] font-medium text-text-primary">{title}</span>
        <span className="block text-[12px] leading-[18px] text-text-secondary">{subtitle}</span>
      </span>
      <ChevronRight size={16} className="text-[#c7c7cc]" />
    </button>
  )
}

function SignedIn({ onContact }: { onContact: () => void }) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const card = 'overflow-hidden rounded-16 border-[0.5px] border-border-default bg-white'
  return (
    <div className="relative mx-auto min-h-dvh max-w-lg bg-white pb-[120px] select-none">
      <header className="flex items-center gap-[6px] border-b-[0.5px] border-border-default bg-white/80 px-[20px] pt-[56px] pb-[12px]">
        <button type="button" aria-label="Back" onClick={back(navigate)} className="flex size-[44px] items-center justify-center rounded-full border border-border-default bg-white text-text-primary">
          <ChevronLeft />
        </button>
        <h1 className="text-[28px] leading-[32px] font-bold text-text-primary">Settings</h1>
      </header>
      <div className="flex flex-col gap-[12px] px-[20px] pt-[12px]">
        <div className="flex items-center gap-[14px] rounded-16 bg-[#f8f8fa] p-[16px]">
          <div className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-default to-primary-dark text-[16px] leading-[24px] font-bold text-white">{user?.initials[0]}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] leading-[20px] font-medium text-text-primary">{user?.name}</p>
            <p className="truncate text-[12px] leading-[18px] text-text-secondary">{user?.email}</p>
          </div>
          <span className="shrink-0 rounded-full bg-border-subtle px-[8px] py-[2px] text-[10px] leading-[15px] font-semibold tracking-[0.25px] text-text-secondary uppercase">Email</span>
        </div>
        <div className={card}>
          <FigmaRow icon={<img alt="" src={transactionHistory} className="size-[18px]" />} title="Transactions" subtitle="Payments and point history" onClick={() => navigate('/tickets')} />
        </div>
        <div className={`${card} divide-y-[0.5px] divide-border-default`}>
          <FigmaRow icon={<FaqIcon />} title="FAQs" subtitle="Common questions" onClick={() => navigate('/account/faqs')} />
          <FigmaRow icon={<ShieldIcon />} title="Privacy Policy" subtitle="How we handle data" onClick={() => navigate('/privacy')} />
          <FigmaRow icon={<TermsIcon />} title="Terms of Service" subtitle="Usage terms" onClick={() => navigate('/terms')} />
          <FigmaRow icon={<MailIcon />} title="Contact support" subtitle="Get help" onClick={onContact} />
        </div>
        <button type="button" onClick={signOut} className="flex h-[72px] items-center gap-[16px] rounded-16 bg-[#f8f8fa] px-[16px] text-left">
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] bg-[#ff3b30]/10 text-[#ff3b30]">
            <SignOutIcon size={18} />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] leading-[22.5px] font-medium text-[#ff3b30]">Sign out</span>
            <span className="block text-[12px] leading-[18px] text-text-secondary">Sign out of your account</span>
          </span>
        </button>
        <Footer />
      </div>
    </div>
  )
}

export default function SettingsMain() {
  const { user } = useAuth()
  const [contact, setContact] = useState(false)
  return (
    <>
      {user ? <SignedIn onContact={() => setContact(true)} /> : <Guest onContact={() => setContact(true)} />}
      <ContactSheet open={contact} onClose={() => setContact(false)} />
    </>
  )
}
