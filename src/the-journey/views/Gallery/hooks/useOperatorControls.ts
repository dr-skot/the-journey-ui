import { useCallback, useEffect, useState } from 'react';
import useJourneyAppState from '../../../hooks/useJourneyAppState';
import useGalleryParticipants from './useGalleryParticipants';
import { Participant } from 'twilio-video';

// both with and without shift key; first half of this string will be used for the labels
const KEYS = 'QWERTYUIOPASDFGHJKL;ZXCVBNM,./qwertyuiopasdfghjkl:zxcvbnm<>?';

export default function useOperatorControls() {
  const participants = useGalleryParticipants();
  const { focusGroup, setFocusGroup, toggleFocus } = useJourneyAppState();
  const [forceGallery, setForceGallery] = useState<boolean>(false);
  const [showHotKeys, setShowHotKeys] = useState<boolean>(true);

  const toggleParticipantFocus = useCallback(
    (participant: Participant) => toggleFocus(participant.identity), [toggleFocus]);

  // hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(true);
      if (e.key === 'Control') setShowHotKeys(true);
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(false);
      if (e.key === 'Control') setShowHotKeys(false);
      if (e.key === '0' || e.key === ')') setFocusGroup([]);
      const idx = KEYS.indexOf(e.key) % (KEYS.length / 2); // KEYS includes shifted KEYS, so % length / 2
      if (participants[idx]) toggleParticipantFocus(participants[idx]);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [toggleFocus, participants, setFocusGroup, toggleParticipantFocus]);

  return { participants, focusGroup,
    focusing: focusGroup.length && !forceGallery,
    hotKeys: showHotKeys ? KEYS : undefined,
    toggleFocus: toggleParticipantFocus,
  };
}
