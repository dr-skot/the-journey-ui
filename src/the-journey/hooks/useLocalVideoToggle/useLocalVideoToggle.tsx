import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useContext, useRef, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useLocalTracks from '../../../twilio/components/VideoProvider/useLocalTracks/useLocalTracks';

export default function useLocalVideoToggle() {
  const [{ room, localTracks }] = useContext(AppContext);
  const { getLocalVideoTrack, removeLocalVideoTrack } = useLocalTracks();
  // const onError = () => {}; // TODO implement
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  const [isPublishing, setIsPublishing] = useState(false);
  const previousDeviceIdRef = useRef<string>();

  const { localParticipant } = room || {};

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      if (videoTrack) {
        previousDeviceIdRef.current = videoTrack.mediaStreamTrack.getSettings().deviceId;
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        removeLocalVideoTrack();
      } else {
        setIsPublishing(true);
        getLocalVideoTrack({ deviceId: { exact: previousDeviceIdRef.current } })
          .then((track: LocalVideoTrack) => localParticipant?.publishTrack(track, { priority: 'low' }))
          // .catch(onError) TODO deal with this
          .finally(() => setIsPublishing(false));
      }
    }
  }, [videoTrack, localParticipant, getLocalVideoTrack, isPublishing, removeLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
