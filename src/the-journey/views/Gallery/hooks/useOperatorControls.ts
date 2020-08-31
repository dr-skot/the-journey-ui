import { useCallback, useContext, useEffect, useReducer } from 'react';
import useGalleryParticipants from './useGalleryParticipants';
import { Participant } from 'twilio-video';
import { AppContext } from '../../../contexts/AppContext';
import { isEqual } from 'lodash';

// both with and without shift key
// first half of this string will be used for the labels
const KEYS = 'QWERTYUIOPASDFGHJKL;ZXCVBNM,./qwertyuiopasdfghjkl:zxcvbnm<>?';

interface OperatorData {
  forceGallery?: boolean,
  hotKeys?: string,
  toggleFocus?: (p: Participant) => void,
}

export default function useOperatorControls() {
  const participants = useGalleryParticipants();
  const [, dispatch] = useContext(AppContext);

  const toggleFocus = useCallback((participant: Participant) =>
      dispatch('toggleFocus', { identity: participant.identity }),
    [dispatch]);

  const [data, setData] = useReducer((state: OperatorData, payload: OperatorData) => {
    const newState = { ...state, ...payload };
    return isEqual(newState, state) ? state : newState;
  }, { forceGallery: false, hotKeys: '', toggleFocus });

  // hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setData({ forceGallery: true });
      if (e.key === 'Control') setData({ hotKeys: KEYS });
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setData({ forceGallery: false });
      if (e.key === 'Control') setData({ hotKeys: KEYS });
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