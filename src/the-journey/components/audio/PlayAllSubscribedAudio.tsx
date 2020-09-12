import React, { useEffect, useState } from 'react';
import { RemoteAudioTrack } from 'twilio-video';
import { useAppContext } from '../../contexts/AppContext';
import { getSubscribedTracks, getTracks } from '../../utils/twilio';
import AudioTrack from './AudioTrack/AudioTrack';

export default function PlayAllSubscribedAudio() {
  const [{ room }] = useAppContext()
  const [tracks, setTracks] = useState<RemoteAudioTrack[]>();

  useEffect(() => {
    if (!room) return;
    const update = () => setTracks(
      getSubscribedTracks(room, 'audio') as RemoteAudioTrack[]
    );
    update();
    room.on('trackSubscribed', update);
    room.on('trackUnsubscribed', update);
    return () => {
      room.off('trackSubscribed', update);
      room.off('trackUnsubscribed', update);
    }
  }, [room])

  if (!tracks) return null;
  return (
    <>
      { tracks.map((track) => <AudioTrack key={track.sid} track={track}/>) }
    </>
  );
}
