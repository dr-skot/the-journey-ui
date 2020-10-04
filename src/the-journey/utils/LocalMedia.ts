import Video, { CreateLocalTrackOptions, LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../constants';

type MediaType = 'audio' | 'video';
type MediaStatus = 'ready' | 'blocked' | 'error' | 'unknown';

interface TrackInfo {
  status: MediaStatus,
  track?: LocalAudioTrack | LocalVideoTrack,
  error?: MediaError,
}


const media: Record<MediaType, TrackInfo> = {
  audio: {
    status: 'unknown',
    track: undefined,
    error: undefined,
  },
  video: {
    status: 'unknown',
    track: undefined,
    error: undefined,
  }
}

// persist deviceIds on reload
function resolveDeviceId(type: MediaType, deviceId?: string) {
  const storageKey = `${type}DeviceId`;
  if (!deviceId) return sessionStorage.getItem(storageKey);
  sessionStorage.setItem(storageKey, deviceId);
  return deviceId;
}

function getCreateTrackOptions(type: MediaType, options: CreateLocalTrackOptions) {
  // Unpublishing one track and publishing a new one can cause a conflict sometimes
  // when the track names are both 'camera', so append a timestamp to the track name
  const videoOptions: CreateLocalTrackOptions = {
    ...(DEFAULT_VIDEO_CONSTRAINTS as CreateLocalTrackOptions),
    name: `camera-${Date.now()}`
  };

  return {
    ...(type === 'video' ? videoOptions : {}),
    ...options
  };

}

export function getLocalTrack(type: MediaType, deviceId?: string) {
  const resolvedDeviceId = resolveDeviceId(type, deviceId);
  const deviceIdOption = resolvedDeviceId
    ? { deviceId: { exact: resolvedDeviceId } }
    : {};
  const options = getCreateTrackOptions(type, deviceIdOption);

  const saveTrackInfo = (track: LocalVideoTrack | LocalAudioTrack) => {
    media[type] = {
      track, status: 'ready', error: undefined
    };
    resolveDeviceId(type, track.mediaStreamTrack.getSettings().deviceId);
    return track;
  };

  const saveError = (error: MediaError) => {
    media[type] = {
      error,
      status: error.code === MediaError.MEDIA_ERR_ABORTED ? 'blocked' : 'error',
      track: undefined,
    }
    return error;
  };

  return type === 'video'
    ? Video.createLocalVideoTrack(options).then(saveTrackInfo).catch(saveError)
    : Video.createLocalAudioTrack(options).then(saveTrackInfo).catch(saveError);
}

