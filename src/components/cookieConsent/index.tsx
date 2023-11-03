import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { CookiesConsentSettings, setCookiesConsentSettings } from '@/rtk';
import { Conditional } from '../logic';
import { Button, CenterContainer } from '../ui';

export function CookieConsent() {
  const [cookieConsentCookieSet, setCookieConsentCookieSet] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const cookie = Cookies.get('cookiesConsentSettings');
    if (cookie) {
      const cookieConstentSettings: CookiesConsentSettings = JSON.parse(cookie);
      if (!cookieConstentSettings) {
        throw new Error('cookieConsentSettings cookie is invalid.');
      }
      setCookieConsentCookieSet(true);
      dispatch(setCookiesConsentSettings(cookieConstentSettings));
    } else {
      setCookieConsentCookieSet(false);
    }
  }, [dispatch]);

  const setCookiesAndUpdateState = useCallback(
    (analyticsCookiesAllowed: boolean) => {
      const settings: CookiesConsentSettings = { analyticsCookiesAllowed };
      Cookies.set('cookiesConsentSettings', JSON.stringify(settings), {
        expires: 365,
      });
      dispatch(setCookiesConsentSettings(settings));
      setCookieConsentCookieSet(true);
    },
    [setCookieConsentCookieSet, dispatch],
  );

  return (
    <Conditional showWhen={!cookieConsentCookieSet}>
      <div className="sticky bottom-0 left-0 w-full bg-neutral-300 dark:bg-neutral-300 dark:text-black p-2 shadow-md shadow-black/5 dark:shadow-black/10 z-[9999]">
        <CenterContainer>
          <div className="flex flex-col md:flex-row items-center">
            <div className="text-sm">
              In addition to essential cookies, this website places cookies on
              your browser that are used for understanding how the site is used
              so we can make your experience better. These are NOT third-party
              cookies and this information is not shared with advertisers or
              other third parties. These cookies are non-essential.{' '}
              <Link href="/privacyPolicy">Learn More</Link>.
            </div>
            <div className="flex max-h-12">
              <Button
                onClick={() => setCookiesAndUpdateState(true)}
                className="text-sm w-28 text-white m-2 bg-lime-500"
              >
                Accept
              </Button>
              <Button
                onClick={() => setCookiesAndUpdateState(false)}
                className="text-sm w-28 text-white m-2 bg-neutral-500"
              >
                Decline
              </Button>
            </div>
          </div>
        </CenterContainer>
      </div>
    </Conditional>
  );
}
