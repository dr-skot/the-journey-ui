import React from 'react';
import { IconButton } from '@material-ui/core';
import UnmutedIcon from '@material-ui/icons/Mic';
import MutedIcon from '@material-ui/icons/MicOff';
import { Participant } from 'twilio-video';
import { useAppState } from '../../../../contexts/AppStateContext';

interface MuteInFocusGroupButtonProps {
  identity: Participant.Identity;
}

export default function MuteInFocusGroupButton({ identity }: MuteInFocusGroupButtonProps) {
  const [{ mutedInFocusGroup }, roomStateDispatch] =  useAppState();

  // I can't figure out what typescript wants here for e
  const toggleMute = (e: any) => {
    e.stopPropagation();
    roomStateDispatch('toggleMembership', { group: 'mutedInFocusGroup', identity });
  }

  const label = mutedInFocusGroup.includes(identity) ? 'unmute' : 'mute';
  const icon = mutedInFocusGroup.includes(identity) ? <MutedIcon /> : <UnmutedIcon />;

  return  (
    <div style={{ width: '100%', textAlign: 'right' }}>
      <IconButton aria-label={label} onClick={toggleMute}>
        {icon}
      </IconButton>
    </div>
  )
}
