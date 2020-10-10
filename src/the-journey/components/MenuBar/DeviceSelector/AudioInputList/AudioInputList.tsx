import React, { useContext } from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import LocalAudioLevelIndicator from '../LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { makeStyles } from '@material-ui/core/styles';
import { useAudioInputDevices } from '../deviceHooks/deviceHooks';
import useMediaStreamTrack from '../../../../../twilio/hooks/useMediaStreamTrack/useMediaStreamTrack';
import { LocalAudioTrack } from 'twilio-video';
import { TwilioRoomContext } from '../../../../contexts/TwilioRoomContext';

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
  const [{ localTracks }] = useContext(TwilioRoomContext);

  const localAudioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const localAudioInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  // console.log('AudioInputList', { localAudioTrack, mediaStreamTrack });

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
      <LocalAudioLevelIndicator />
    </div>
  );
}
