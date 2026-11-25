import { hoursBefore } from '../../data/policy'
import { tripOf, type TicketView } from '../../data/tickets'
import { IconRow, RowCard, SectionLabel } from './IconRows'

// "Before you board" on the booking confirmation: when to be at the port, which IDs to bring, weather / email.
// Not in Figma yet — same row style as the operator policy on Review & pay.

function idDetail(types: string[]) {
  const has = (s: string) => types.some((t) => t.toLowerCase().includes(s))
  const extra = [has('senior') && 'Senior ID', has('pwd') && 'PWD ID', has('student') && 'school ID', (has('child') || has('infant')) && 'birth certificate for kids'].filter(Boolean)
  return extra.length ? `Government ID · ${extra.join(' · ')}` : 'Any government-issued ID per passenger'
}

export default function NextSteps({ ticket }: { ticket: TicketView }) {
  const arriveBy = hoursBefore(tripOf(ticket).departTime, 2)
  return (
    <section aria-label="Before you board" className="flex w-full flex-col gap-[12px] pt-[16px]">
      <SectionLabel icon="clock">Before you board</SectionLabel>
      <RowCard>
        <IconRow icon="clock" title={arriveBy ? `Be at the port by ${arriveBy}` : 'Be at the port 2 hours early'} detail="2 hours before departure, for check-in and port fees" />
        <IconRow icon="id" title="Bring valid IDs" detail={idDetail(ticket.booking.passengers.map((p) => p.fareType))} />
        <IconRow icon="cloud" title="Watch your email" detail="We’ll tell you if weather changes your trip" />
      </RowCard>
    </section>
  )
}
