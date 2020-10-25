import { useEffect } from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import { DEFAULT_DELAY, DEFAULT_GAIN, setDelayTime, setGain } from '../../utils/AudioOut';
import { playTracks } from '../../utils/trackPlayer';
import useRemoteTracks from '../../hooks/useRemoteTracks';
import { RemoteAudioTrack, Participant } from 'twilio-video';
import { pick, values, flatMap } from 'lodash';

interface PlayAudioTracksProps {
  group?: Participant.Identity[],
  controlled?: boolean,
}

export default function PlayAudioTracks({ group, controlled }: PlayAudioTracksProps) {
  const trackMap = useRemoteTracks('audio') as Record<Participant.Identity, RemoteAudioTrack[]>;
  const [{ delayTime, gain, muteAll }] = useAppState();

  console.debug('PlayAudioTracks', { group, controlled });
  console.debug('trackMap', trackMap);

  useEffect(() => {
    setDelayTime(controlled ? delayTime : DEFAULT_DELAY);
    setGain(controlled ? gain : DEFAULT_GAIN);
  }, [controlled, delayTime, gain]);

  useEffect(() => {
    let selection = group ? pick(trackMap, group) : trackMap;
    console.log('PlayAudioTracks.selection', selection);
    playTracks(controlled && muteAll ? [] : flatMap(values(selection)));
  }, [group, controlled, trackMap, muteAll]);

  return null;
}

