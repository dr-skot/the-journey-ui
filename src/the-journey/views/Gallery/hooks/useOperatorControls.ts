import { useCallback, useContext, useEffect, useState } from 'react';
import useJourneyAppState from '../../../hooks/useJourneyAppState';
import useGalleryParticipants from './useGalleryParticipants';
import { Participant } from 'twilio-video';
import { AppContext } from '../../../contexts/AppContext';

// both with and without shift key
// first half of this string will be used for the labels
const KEYS = 'QWERTYUIOPASDFGHJKL;ZXCVBNM,./qwertyuiopasdfghjkl:zxcvbnm<>?';

export default function useOperatorControls() {
  const participants = useGalleryParticipants();
  const [{ focusGroup }, dispatch] = useContext(AppContext);
  const [forceGallery, setForceGallery] = useState<boolean>(false);
  const [forceHotKeys, setForceHotKeys] = useState<boolean>(false);

  const toggleParticipantFocus = useCallback((participant: Participant) =>
    dispatch('toggleFocus', { identity: participant.identity }),
    [dispatch]);

  // hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(true);
      if (e.key === 'Control') setForceHotKeys(true);
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setForceGallery(false);
      if (e.key === 'Control') setForceHotKeys(false);
      if (e.key === '0' || e.key === ')') dispatch('clearFocus');
      // KEYS includes shifted KEYS, so % length / 2
      const idx = KEYS.indexOf(e.key) % (KEYS.length / 2);
      if (participants[idx]) toggleParticipantFocus(participants[idx]);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [participants, dispatch, toggleParticipantFocus]);

  const focusing = focusGroup.length && !forceGallery;
  const hotKeys = !focusing || forceHotKeys ? KEYS : undefined;

  console.log('ugh', { participants, focusGroup });

  return {
    participants: focusing ? participants.filter(p => focusGroup.includes(p.identity)) : participants,
    focusGroup, focusing, hotKeys, toggleFocus: toggleParticipantFocus,
  };
}
