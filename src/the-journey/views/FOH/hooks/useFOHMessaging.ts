import { useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { isRole } from '../../../utils/twilio';
import useParticipants from '../../../hooks/useParticipants/useParticipants';

const MESSAGE_DELAY = 1500;

export default function useFOHMessaging() {
  const [{ room, admitted, rejected, mutedInLobby }, dispatch] = useContext(AppContext);
  const participants = useParticipants();
  const me = room?.localParticipant;
  const amFOH = isRole('foh')(me);

  // be broadcasting
  useEffect(() => {
    console.log('Im FOH & Im gonna publish a data track');
    if (amFOH && (me!.dataTracks.size === 0)) dispatch('publishDataTrack');
  }, [amFOH, me, dispatch]);

  // sync data when new participants arrive
  useEffect(() => {
    if (!amFOH) return;
    let message = {};
    if (admitted.length) message = { ...message, admitted };
    if (rejected.length) message = { ...message, rejected };
    if (mutedInLobby.length) message = { ...message, mutedInLobby };
    // give them a couple of seconds to subscribe to the data channel
    console.log('FOH broadcasting admitted/rejected lists after change in participants');
    setTimeout(() => dispatch('broadcast', message), MESSAGE_DELAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants, amFOH, dispatch]); // only when new participants arrive
}

