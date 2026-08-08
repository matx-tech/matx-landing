export function SubprocessorTable() {
  return (
    <>
      <p className='mb-4'>Töötleja kasutab järgmisi allatöötlejaid:</p>
      <div className='overflow-x-auto -mx-2 sm:mx-0'>
        <table className='min-w-full border-collapse'>
          <thead>
            <tr className='border-b-2 border-border'>
              <th className='text-left py-3 px-4 text-sm font-semibold text-text-primary'>
                Allatöötleja
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-text-primary'>
                Teenus
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-text-primary'>
                Asukoht / Õiguslik alus
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-text-primary'>
                DPA / Tingimused
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-border'>
              <td className='py-3 px-4 text-sm font-medium text-text-primary'>LuxVPS</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Veebimajutus</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Luxembourg (EL)</td>
              <td className='py-3 px-4 text-sm'>
                <a
                  href='https://luxvps.net/terms'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:text-secondary underline'
                >
                  luxvps.net/terms
                </a>
              </td>
            </tr>
            <tr className='border-b border-border'>
              <td className='py-3 px-4 text-sm font-medium text-text-primary'>Cloudflare Inc.</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>CDN, DDoS kaitse, e-post</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>USA (EU-U.S. DPF + SCCs)</td>
              <td className='py-3 px-4 text-sm'>
                <a
                  href='https://cloudflare.com/cloudflare-customer-dpa'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:text-secondary underline'
                >
                  Cloudflare DPA
                </a>
              </td>
            </tr>
            <tr className='border-b border-border'>
              <td className='py-3 px-4 text-sm font-medium text-text-primary'>Stripe / PayPal</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Maksete töötlemine</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>USA / EL (SCCs)</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Via LuxVPS</td>
            </tr>
            <tr className='border-b border-border'>
              <td className='py-3 px-4 text-sm font-medium text-text-primary'>Brevo</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>E-posti saatmine</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Prantsusmaa (EL)</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Via LuxVPS</td>
            </tr>
            <tr className='border-b border-border'>
              <td className='py-3 px-4 text-sm font-medium text-text-primary'>Google Analytics</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Veebiliikluse analüütika</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>USA (EU-U.S. DPF)</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Via LuxVPS</td>
            </tr>
            <tr className='border-b border-border'>
              <td className='py-3 px-4 text-sm font-medium text-text-primary'>Tawk.to</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Klienditugi (chat)</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>USA</td>
              <td className='py-3 px-4 text-sm text-text-secondary'>Via LuxVPS</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className='mt-4 text-text-secondary text-sm'>
        Täielik LuxVPS allatöötlejate nimekiri:{' '}
        <a
          href='https://luxvps.net/terms'
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary hover:text-secondary underline'
        >
          luxvps.net/terms
        </a>{' '}
        (section 5.2). Cloudflare allatöötlejad:{' '}
        <a
          href='https://cloudflare.com/gdpr/subprocessors'
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary hover:text-secondary underline'
        >
          cloudflare.com/gdpr/subprocessors
        </a>{' '}
        (30 päeva etteteatamisega uuendatakse).
      </p>
      <p className='mt-4 text-text-secondary text-sm'>
        Uute allatöötlejate lisamine: Töötleja teavitab Vastutavat töötlejat 30 päeva ette.
        Vastutaval töötlejal on õigus esitada vastuväiteid 10 päeva jooksul põhjendatud andmekaitse
        kaalutlustel. Vastutaval töötlejal on õigus tutvuda allatöötlejate lepingutega. Töötleja
        vastutab allatöötlejate GDPR-i nõuete täitmise eest nagu enda eest.
      </p>
    </>
  );
}

export function SecurityMeasuresSection() {
  return (
    <>
      <p className='mb-4'>Rakendame järgmisi GDPR artikkel 32 kohased turvameetmeid:</p>
      <ul className='space-y-3 ml-6 list-none'>
        <li className='text-text-secondary text-sm leading-relaxed'>
          <strong className='text-text-primary'>Krüpteerimine:</strong> Andmed krüpteeritud
          edastamisel (TLS 1.3) ja andmebaasis (AES-256); varukoopiad krüpteeritud.
        </li>
        <li className='text-text-secondary text-sm leading-relaxed'>
          <strong className='text-text-primary'>Juurdepääsu kontroll:</strong> MFA (multi-factor
          authentication) kohustuslik kõigile töötajatele; rollipõhine juurdepääs (RBAC);
          juurdepääsu logid säilitatakse 12 kuud.
        </li>
        <li className='text-text-secondary text-sm leading-relaxed'>
          <strong className='text-text-primary'>Pseudonümiseerimine:</strong> Õpilaste nimed
          asendatakse ID-numbritega tehniliste logide ja veaotsingu käigus.
        </li>
        <li className='text-text-secondary text-sm leading-relaxed'>
          <strong className='text-text-primary'>Varukoopiad:</strong> Igapäevased automaatsed
          varukoopiad, säilitamine 30 päeva, krüpteeritud.
        </li>
        <li className='text-text-secondary text-sm leading-relaxed'>
          <strong className='text-text-primary'>Turvaauditid:</strong> Proksiabel OÜ (registrikood
          17017826, proksiabel.ee, sõsarfirma küberturvalisuse vallas) viib läbi iga-aastase
          turvaauditi. Audiitiraport kättesaadav Vastutavale töötlejale nõudmisel.
        </li>
        <li className='text-text-secondary text-sm leading-relaxed'>
          <strong className='text-text-primary'>Intsidendi monitooring:</strong> Automaatsed
          turvahälvete teatised.
        </li>
      </ul>
      <p className='mt-4 text-text-secondary text-sm'>
        Vastutaval töötlejal on õigus nõuda täiendavat sõltumatut kolmanda osapoole auditit (kulud
        jagatud võrdselt).
      </p>
    </>
  );
}
