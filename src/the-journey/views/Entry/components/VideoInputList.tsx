import React, { useContext } from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { LocalVideoTrack } from 'twilio-video';
import { TwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../../../constants';
import useMediaStreamTrack from '../../../../twilio/hooks/useMediaStreamTrack/useMediaStreamTrack';
import { useVideoInputDevices } from '../../../components/MenuBar/DeviceSelector/deviceHooks/deviceHooks';

export default function VideoInputList() {
  const videoInputDevices = useVideoInputDevices();
  const [{ localTracks }] = useContext(TwilioRoomContext);

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  const localVideoInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    localVideoTrack.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: newDeviceId },
    });
  }

  return (
    <div>
      {videoInputDevices.length > 1 ? (
        <FormControl>
          <Typography variant="h6">Video Input:</Typography>
          <Select onChange={e => replaceTrack(e.target.value as string)} value={localVideoInputDeviceId || ''}>
            {videoInputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="h6">Video Input:</Typography>
          <Typography>{localVideoTrack?.mediaStreamTrack.label || 'No Local Video'}</Typography>
        </>
      )}
    </div>
  );
}
