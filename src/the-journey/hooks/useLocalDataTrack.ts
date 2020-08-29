import { LocalDataTrack } from 'twilio-video';
import { useEffect, useState } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const { values } = Object;

export default function useLocalDataTrack() {
  const { room } = useVideoContext();
  const [dataTrack] = useState<LocalDataTrack>(new LocalDataTrack());

  useEffect(() => {
    if (!values(room.localParticipant.dataTracks).some((publication) => publication.track === dataTrack)) {
      room.localParticipant.publishTrack(dataTrack);
    }
  }, [dataTrack, room.localParticipant]);

  return dataTrack;
}
