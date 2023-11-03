import Script from 'next/script';
import { useSelector } from 'react-redux';
import { RootState } from '@/rtk';
import { Conditional } from '../logic/clientConditional';

export function HotJar() {
  const analyticsCookiesAllowed = useSelector(
    (state: RootState) => state.cookiesConsentSettings.analyticsCookiesAllowed,
  );

  return (
    <Conditional showWhen={analyticsCookiesAllowed}>
      <Script id="hotjar">
        {`(function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid: ${parseInt(
                          process.env.NEXT_PUBLIC_HOTJAR_HJID!,
                          10,
                        )},
                            hjsv: ${parseInt(
                              process.env.NEXT_PUBLIC_HOTJAR_HJSV!,
                              10,
                            )}};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
      </Script>
    </Conditional>
  );
}
