import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export const SOURCE = 'https://github.com/jimfeserHTW/SN'

// Legal texts stay German only: the German version is the binding one.
// shortcut: [..] placeholders must be filled with the operator's real details before going public.
const IMPRESSUM = (
  <>
    <h2>Angaben gemäß § 5 DDG</h2>
    <p>Jim Feser<br />Löwenberger Str. 4<br />10315 Berlin<br />Deutschland</p>
    <h2>Kontakt</h2>
    <p>E-Mail: jim.feser@student.htw-berlin.de</p>
    <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
    <p>Jim Feser, Anschrift wie oben</p>
    <h2>Haftung für Inhalte und Links</h2>
    <p>Die Inhalte dieser Seite wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr übernommen. Für Inhalte externer Seiten, auf die verlinkt wird, sind ausschließlich deren Betreiber verantwortlich.</p>
    <h2>Lizenz</h2>
    <p>StudyNothing ist freie Software unter der GNU Affero General Public License v3.0. Der Quellcode ist öffentlich verfügbar: <a href={SOURCE}>{SOURCE}</a></p>
  </>
)

const DATENSCHUTZ = (
  <>
    <h2>1. Verantwortlicher</h2>
    <p>Jim Feser, Löwenberger Str. 4, 10315 Berlin, E-Mail: jim.feser@student.htw-berlin.de</p>
    <h2>2. Hosting und Server-Logfiles</h2>
    <p>Diese Website wird über GitHub Pages bereitgestellt (GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf verarbeitet GitHub technisch notwendige Daten wie IP-Adresse, Zeitpunkt, aufgerufene Datei und Browserkennung, um die Seite auszuliefern und abzusichern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren, funktionierenden Bereitstellung). Eine Übermittlung in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework, unter dem GitHub zertifiziert ist. Details: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement">Datenschutzerklärung von GitHub</a>.</p>
    <h2>3. Keine Cookies, kein Tracking</h2>
    <p>Diese Seite setzt keine Cookies und verwendet keine Analyse-, Tracking- oder Werbedienste. Schriftarten werden lokal ausgeliefert, es werden keine Inhalte von Drittanbietern nachgeladen.</p>
    <h2>4. Lokaler Speicher</h2>
    <p>Die gewählte Sprache wird im lokalen Speicher Ihres Browsers (localStorage, Schlüssel „lang“) abgelegt, damit sie beim nächsten Besuch erhalten bleibt. Unter „Mein Bereich“ werden außerdem Ihr Lernfortschritt (gesehene Folien, gelöste Quizaufgaben mit Zeitpunkt und Ergebnis, geschaffte Lab-Schritte) und Ihre Einstellungen dort gespeichert (Schlüssel „me“). Diese Werte verlassen Ihr Gerät nicht und können jederzeit über die Browsereinstellungen gelöscht werden. Die Speicherung ist für den von Ihnen gewünschten Dienst erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).</p>
    <h2>5. Kontakt per E-Mail</h2>
    <p>Wenn Sie per E-Mail Kontakt aufnehmen, werden Ihre Angaben nur zur Bearbeitung der Anfrage verwendet (Art. 6 Abs. 1 lit. b bzw. f DSGVO) und gelöscht, sobald sie nicht mehr erforderlich sind.</p>
    <h2>6. Ihre Rechte</h2>
    <p>Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO). Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).</p>
    <p className="dim">Stand: November 2026</p>
  </>
)

export const LEGAL = {
  impressum: { title: 'Impressum', body: IMPRESSUM },
  datenschutz: { title: 'Datenschutz', body: DATENSCHUTZ },
} as const
export type LegalId = keyof typeof LEGAL

export function LegalView({ id }: { id: LegalId }) {
  const { t } = useTranslation()
  const h1 = useRef<HTMLHeadingElement>(null)
  useEffect(() => { window.scrollTo({ top: 0 }); h1.current?.focus({ preventScroll: true }) }, [id])
  return (
    <div className="page legal">
      <a className="crumb" href="#/">{t('Home')}</a>
      <h1 ref={h1} tabIndex={-1}>{t(LEGAL[id].title)}</h1>
      {LEGAL[id].body}
    </div>
  )
}
