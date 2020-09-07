import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import useGalleryParticipants, { MuppetOption } from '../../Gallery/hooks/useGalleryParticipants';
import { Participant } from 'twilio-video';
import { isEqual } from 'lodash';
import { SharedRoomContext } from '../../../contexts/SharedRoomContext';
import { toggleMembership } from '../../../utils/functional';
import { cached } from '../../../utils/react-help';

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
  const [{ focusGroup }, setSharedState] = useContext(SharedRoomContext);
  const [forceGallery, setForceGallery] = useState(false);
  const [forceHotKeys, setForceHotKeys] = useState(true);

  const toggleFocus = useCallback((participant: Participant) => {
    console.log('toggleFocus', { focusGroup, identitiy: participant.identity });
    // @ts-ignore
    setSharedState({ focusGroup: toggleMembership(focusGroup)(participant.identity) });
  },
    [focusGroup, setSharedState]);

  const clearFocus = useCallback(() =>
    // @ts-ignore
    setSharedState({ focusGroup: [] }),
    [setSharedState]);

  const [data, setData] = useReducer((state: OperatorData, payload: OperatorData) => {
    const newState = { ...state, ...payload };
    return isEqual(newState, state) ? state : newState;
  }, { forceGallery: false, forceHotKeys: false, toggleFocus });

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
