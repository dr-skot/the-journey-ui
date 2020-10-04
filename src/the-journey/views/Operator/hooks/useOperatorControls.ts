import { useCallback, useEffect, useState } from 'react';
import { Participant } from 'twilio-video';
import { cached } from '../../../utils/react-help';
import { useAppState } from '../../../contexts/AppStateContext';
import useAudience from '../../../hooks/useAudience';

// both with and without shift key
// first half of this string will be used for the labels
export const KEYS = 'QWERTYUIOPASDFGHJKL;ZXCVBNM,./qwertyuiopasdfghjkl:zxcvbnm<>?';

interface OperatorData {
  forceGallery?: boolean,
  forceHotKeys?: boolean,
  toggleFocus?: (p: Participant) => void,
}

export default function useOperatorControls() {
  let participants = useAudience();
  const [, roomStateDispatch] = useAppState();
  const [forceGallery, setForceGallery] = useState(false);
  const [forceHotKeys, setForceHotKeys] = useState(true);

  const toggleFocus = useCallback((participant: Participant) =>
    roomStateDispatch('toggleMembership', { group: 'focusGroup', identity: participant.identity }),
    [roomStateDispatch]);

  const clearFocus = useCallback(() =>
    roomStateDispatch('clearMembership', { group: 'focusGroup' }),
    [roomStateDispatch]);

  // hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(true);
      if (e.key === 'Control') setForceHotKeys(true);
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(false);
      if (e.key === 'Control') setForceHotKeys(false);
      if (e.key === '0' || e.key === ')') clearFocus();
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
  }, [participants, clearFocus, toggleFocus]);


  return cached('useOperatorControls')
    .ifEqual({ forceGallery, forceHotKeys, toggleFocus }) as OperatorData;
}
