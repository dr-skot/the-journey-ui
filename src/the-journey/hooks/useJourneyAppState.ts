import { useCallback, useEffect, useReducer, useState } from 'react';
import useLocalDataTrack from './useLocalDataTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useRemoteTracks, { justTracks } from './useRemoteTracks';

const toggleMembership = (xs: any[]) => (x: any) => xs.includes(x) ? xs.filter(xx => xx !== x) : [...xs, x];

export default function useJourneyAppState() {
  const [audioContext] = useState(AudioContext && new AudioContext());
  const [audioDelay, setAudioDelay] = useReducer((_: number, delay: number) => delay, 0);
  const [focusGroup, setFocusGroup] = useState<string[]>([]);
  const { room } = useVideoContext();
  const localDataTrack = useLocalDataTrack();
  const remoteDataTracks = justTracks('data', useRemoteTracks());

  const toggleFocus = useCallback((identity: string) => (
    setFocusGroup((prevGroup) => toggleMembership(prevGroup)(identity)
  )), [setFocusGroup])


  // sync values via data channels:

  // sends updates to data track (if there is one -- only operators have them)
  const sendUpdate = useCallback((explicitValues = undefined) => {
    if (localDataTrack) localDataTrack.send(JSON.stringify(explicitValues || { focusGroup, audioDelay }));
  }, [localDataTrack, focusGroup, audioDelay]);

  // send updates when values change
  useEffect(() => sendUpdate({ focusGroup, audioDelay }),
    [focusGroup, audioDelay, sendUpdate]);

  // send updates when new participants join
  useEffect(() => {
    room.on('participantConnected', sendUpdate);
    return () => { room.off('participantConnected', sendUpdate) };
  }, [room, sendUpdate]);

  // listen for updates from all remote data tracks
  useEffect(() => {
    const messageListener = (data: string) => {
      console.log('recieved data track message', data);
      const message = JSON.parse(data);
      if (message.focusGroup) setFocusGroup(message.focus);
      if (message.audioDelay) setAudioDelay(message.audioDelay);
    }
    remoteDataTracks.forEach((track) => track.on('message', messageListener));
    return () => remoteDataTracks.forEach((track) => track.off('message', messageListener));
  }, [remoteDataTracks]);


  return {
    audioContext,
    audioDelay, setAudioDelay,
    focusGroup, setFocusGroup, toggleFocus,
  };
}
