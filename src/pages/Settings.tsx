import { Route, Routes } from 'react-router'
import Faqs from '../components/settings/Faqs'
import Legal from '../components/settings/Legal'
import SettingsMain from '../components/settings/SettingsMain'

// Settings (live: book.tripket.ph/account). FAQs / Privacy / Terms open full-screen over it (no tab bar), Contact Support is a modal.
// Live quirk: Transactions sends a guest to /tickets.
export default function Settings() {
  return (
    <Routes>
      <Route index element={<SettingsMain />} />
      <Route path="faqs" element={<Faqs />} />
      <Route path="privacy" element={<Legal kind="privacy" />} />
      <Route path="terms" element={<Legal kind="terms" />} />
      <Route path="*" element={<SettingsMain />} />
    </Routes>
  )
}
