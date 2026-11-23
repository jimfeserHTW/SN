import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import './layout.css'
import './present.css'
import './i18n.ts'
import App from './App.tsx'
import { keepFullscreen } from './components/Me.tsx'

keepFullscreen()
createRoot(document.getElementById('root')!).render(<App />)
