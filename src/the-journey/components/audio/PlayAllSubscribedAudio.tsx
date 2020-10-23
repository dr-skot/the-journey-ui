import { useContext, useEffect } from 'react';
import { getIdentities } from '../../utils/twilio';
import { AudioStreamContext } from '../../contexts/AudioStreamContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';

export default function PlayAllSubscribedAudio() {
  const participants = useParticipants();
  const { setUnmutedGroup } = useContext(AudioStreamContext);

  useEffect(() => {
    setUnmutedGroup(getIdentities(participants));
  }, [participants, setUnmutedGroup]);

  return null;
}
