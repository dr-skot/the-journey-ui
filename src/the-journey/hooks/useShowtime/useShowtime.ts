import { useAppState } from '../../contexts/AppStateContext';
import useCode from '../useCode';
import { getEntryWindow, validateCode } from '../../utils/foh';
import { DateTime } from 'luxon';

export interface ShowtimeInfo {
  code: string,
  curtain: DateTime,
  open: DateTime,
  close: DateTime,
  timezone: string,
}


export default function useShowtime() {
  const [{ doorsOpen, doorsClosed }] = useAppState();
  const code = useCode();

  const validCode = validateCode(code);
  if (!code || !validCode) return undefined;

  const { curtain, timezone } = validCode;
  const { open, close } = getEntryWindow(curtain, doorsOpen, doorsClosed);

  // shave seconds off curtain
  const normalizedCurtain = curtain?.minus({ seconds: curtain.second });

  // TODO cache this sufficiently so as not to rerender constantly
  return { code, curtain: normalizedCurtain, open, close, timezone } as ShowtimeInfo;
}
