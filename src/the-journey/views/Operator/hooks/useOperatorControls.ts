import { useCallback, useContext, useEffect, useReducer } from 'react';
import useGalleryParticipants, { MuppetOption } from '../../Gallery/hooks/useGalleryParticipants';
import { Participant } from 'twilio-video';
import { AppContext } from '../../../contexts/AppContext';
import { isEqual } from 'lodash';

// both with and without shift key
// first half of this string will be used for the labels
export const KEYS = 'QWERTYUIOPASDFGHJKL;ZXCVBNM,./qwertyuiopasdfghjkl:zxcvbnm<>?';

interface OperatorData {
  forceGallery?: boolean,
  forceHotKeys?: boolean,
  toggleFocus?: (p: Participant) => void,
}

export default function useOperatorControls({ withMuppets }: MuppetOption = {}) {
  let participants = useGalleryParticipants({ withMuppets });
  const [, dispatch] = useContext(AppContext);

  const toggleFocus = useCallback((participant: Participant) =>
      dispatch('toggleFocus', { identity: participant.identity }),
    [dispatch]);

  // TODO am I working too hard here to avoid a rerender, and is it even succeeding?
  const [data, setData] = useReducer((state: OperatorData, payload: OperatorData) => {
    const newState = { ...state, ...payload };
    return isEqual(newState, state) ? state : newState;
  }, { forceGallery: false, forceHotKeys: false, toggleFocus });

  // hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setData({ forceGallery: true });
      if (e.key === 'Control') setData({ forceHotKeys: true });
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setData({ forceGallery: false });
      if (e.key === 'Control') setData({ forceHotKeys: false });
      if (e.key === '0' || e.key === ')') dispatch('clearFocus');
      // KEYS includes shifted KEYS, so % length / 2
      const idx = KEYS.indexOf(e.key) % (KEYS.length / 2);
      if (participants[idx]) toggleFocus(participants[idx]);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [participants, dispatch, toggleFocus]);

  return data;
}
