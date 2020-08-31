import { LocalDataTrack } from 'twilio-video';
import { useContext, useEffect, useState } from 'react';
import useVideoContext from './useVideoContext';
import { AppContext } from '../contexts/AppContext';

const { values } = Object;

export default function useLocalDataTrack() {
  const [{ room }] = useContext(AppContext);
  const [dataTrack] = useState<LocalDataTrack>(new LocalDataTrack());

  useEffect(() => {
    if (!room) return
    if (!values(room.localParticipant.dataTracks).some((publication) => publication.track === dataTrack)) {
      room.localParticipant.publishTrack(dataTrack);
    }
  }, [dataTrack, room]);

  return dataTrack;
}
