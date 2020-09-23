import { LocalDataTrack } from 'twilio-video';
import { useContext, useEffect, useState } from 'react';
import { TwilioRoomContext } from '../contexts/TwilioRoomContext';

const { values } = Object;

export default function useLocalDataTrack() {
  const [{ room }] = useContext(TwilioRoomContext);
  const [dataTrack] = useState<LocalDataTrack>(new LocalDataTrack());

  useEffect(() => {
    if (!room) return
    if (!values(room.localParticipant.dataTracks).some((publication) => publication.track === dataTrack)) {
      room.localParticipant.publishTrack(dataTrack);
    }
  }, [dataTrack, room]);

  return dataTrack;
}
