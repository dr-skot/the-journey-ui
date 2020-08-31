import { useCallback, useEffect, useState } from 'react';
import useLocalDataTrack from './useLocalDataTrack';
import useVideoContext from './useVideoContext';
import useRemoteTracks, { justTracks } from './useRemoteTracks';
import { isEqual } from 'lodash';
import { toggleMembership } from '../utils/functional';
import { ifChanged } from '../utils/react-help';

export default function useJourneyAppState() {
  const [audioContext] = useState(AudioContext && new AudioContext());
  const [audioDelay, setAudioDelay] = useState(0);
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
    //const thing = { ...explicitValues, x: 1, y: 'ha', z: explicitValues.focusGroup, q: [1,2,3], m:['array','of','strings'] };
    console.log('send update', JSON.stringify(explicitValues || { focusGroup, audioDelay }));
    //console.log('sending thing', JSON.stringify(thing));
    if (localDataTrack) localDataTrack.send(JSON.stringify(explicitValues || { focusGroup, audioDelay }));
    //if (localDataTrack) localDataTrack.send(JSON.stringify(thing));
  }, [localDataTrack, focusGroup, audioDelay]);

  // send updates when values change
  useEffect(() => {
      console.log('sending update', { focusGroup, audioDelay });
      sendUpdate({ focusGroup, audioDelay })
    },[focusGroup, audioDelay, sendUpdate]);

  // send updates when new participants join
  useEffect(() => {
    room?.on('participantConnected', sendUpdate);
    return () => { room?.off('participantConnected', sendUpdate) };
  }, [room, sendUpdate]);

  // listen for updates from all remote data tracks
  useEffect(() => {
    const messageListener = (...args: any[]) => {
      console.log('recieved data track message', args);
      const data = args[0];
      const message = JSON.parse(data);
      setFocusGroup((prev) => {
        if (isEqual(prev, message.focusGroup) || !message.focusGroup) {
          console.log('theyre equal, resending prev', prev);
          return prev;
        } else {
          console.log('not equal, sending new', message.focusGroup);
          return message.focusGroup;
        }
      });
      setAudioDelay(ifChanged(message.audioDelay));
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
