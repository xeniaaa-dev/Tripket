import { useLocation, useNavigate } from 'react-router'
import logo from '../../../assets/figma/settings/login-logo.svg'
import loginBg from '../../../assets/figma/settings/login-bg.png'
import { MailIcon } from '../icons'

// Figma: "Tripket - Login - No SSO" (11598:32412). Full-bleed sunset photo, gradient to black, logo top-left.
// Fluid: the photo covers the whole column (512px on desktop, the window on a phone) and the text block sits at the bottom.
export default function Welcome() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = (state as { from?: string } | null)?.from
  return (
    <div className="animate-page-enter relative flex min-h-[max(760px,calc(var(--screen-vh)*100))] w-full flex-col overflow-hidden bg-[#0f172a] text-white select-none">
      <img alt="" src={loginBg} className="absolute inset-0 size-full max-w-none object-cover object-top" />
      <div className="absolute inset-x-0 bottom-0 h-[620px] bg-gradient-to-t from-black/75 to-black/0" />

      <div className="relative flex items-center gap-[10px] px-[24px] pt-[62px]">
        <img alt="" src={logo} className="h-[28px] w-[45px]" />
        <span className="text-[17px] leading-[25.5px] font-semibold tracking-[-0.425px]">Tripket PH</span>
      </div>

      <div className="relative mt-auto px-[24px] pb-[67px]">
        <h1 className="text-[32px] leading-[48px] font-bold tracking-[-0.8px]">Welcome back</h1>
        <p className="mt-[6px] text-[14px] leading-[22.5px] tracking-[-0.7px]">Keep your tickets and passenger details in one place.</p>
        <button
          type="button"
          onClick={() => navigate('/login/email', { state: { from } })}
          className="bg-primary-gradient mt-[23px] flex h-[52px] w-full items-center justify-center gap-[4px] rounded-16 text-[15px] font-semibold tracking-[-0.6px] shadow-button transition-transform active:scale-[0.98]"
        >
          <MailIcon size={18} />
          Continue with email
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-[16px] h-[52px] w-full rounded-16 border-[0.55px] border-border-default bg-white/10 text-[15px] tracking-[-0.6px] backdrop-blur-sm transition-transform active:scale-[0.98]"
        >
          Continue as guest
        </button>
        <p className="mx-auto mt-[14px] max-w-[279px] text-center text-[12px] leading-[18px] tracking-[-0.48px]">Google, Apple, and Facebook sign-in coming soon.</p>
        <p className="mx-auto mt-[66px] max-w-[278px] text-center text-[12px] leading-[16px] tracking-[-0.48px] text-white/50">
          By continuing, you agree to our <span className="text-white">Terms of Service</span> and <span className="text-white">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
