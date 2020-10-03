import React from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LocalAudioTrack } from 'twilio-video';
import { useAudioInputDevices } from '../../../components/MenuBar/DeviceSelector/deviceHooks/deviceHooks';
import { useTwilioRoomContext } from '../../../contexts/TwilioRoomContext';
import useMediaStreamTrack from '../../../../twilio/hooks/useMediaStreamTrack/useMediaStreamTrack';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});

export default function AudioInputList() {
  const classes = useStyles();
  const audioInputDevices = useAudioInputDevices();
  const [{ localTracks }] = useTwilioRoomContext();

  const localAudioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const localAudioInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    sessionStorage.setItem('audioDeviceId', newDeviceId);
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  return (
    <div className={classes.container}>
      <div className="inputSelect">
        {audioInputDevices.length > 1 ? (
          <FormControl fullWidth>
            <Typography variant="h6">Audio Input:</Typography>
            <Select onChange={e => replaceTrack(e.target.value as string)} value={localAudioInputDeviceId || ''}>
              {audioInputDevices.map(device => (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <>
            <Typography variant="h6">Audio Input:</Typography>
            <Typography>{localAudioTrack?.mediaStreamTrack.label || 'No Local Audio'}</Typography>
          </>
        )}
      </div>
    </div>
  );
}
