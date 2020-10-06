import { flatMap } from 'lodash';
import { inGroup } from '../../utils/twilio';
import { Participant, RemoteAudioTrack, RemoteParticipant } from 'twilio-video';

interface PlayStreamsProps {
  participants: Participant[],
  unmuteGroup: Participant.Identity[],
  volume: number,
  muteAll: boolean,
}

export function playStreams({ participants, unmuteGroup, volume, muteAll }: PlayStreamsProps) {
  playStreams.cleanUp();
  const tracks = muteAll
    ? []
    : flatMap(participants.filter(inGroup(unmuteGroup)), ((p: RemoteParticipant) => (
      Array.from(p.audioTracks.values())
        .map((pub) => pub.track)
        .filter((track) => track !== null)))) as unknown as RemoteAudioTrack[];

  tracks.forEach((track) => playTrack(track, volume));

  playStreams.cleanUp = () => tracks.forEach((track) => stopTrack(track));
}
playStreams.cleanUp = () => {};


function playTrack(track: RemoteAudioTrack, volume: number) {
  const audioElement = track.attach();
  audioElement.addEventListener('canplay', () => {
    const volumeSettable = audioElement as { volume: number };
    volumeSettable.volume = volume;
  });
  document.body.appendChild(audioElement);
}

function stopTrack(track: RemoteAudioTrack) {
  track.detach().forEach((el) => el.remove());
}

