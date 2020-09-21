import React, { useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import VerifiedIcon from '@material-ui/icons/CheckCircle';
import { toggleMembership } from '../../../utils/functional';
import { Participant, RemoteAudioTrack } from 'twilio-video';
import AudioLevelIndicator from '../../../../twilio/components/AudioLevelIndicator/AudioLevelIndicator';
import CameraIcon from '@material-ui/icons/Videocam';
import CameraOffIcon from '@material-ui/icons/VideocamOff';
import { inGroup, isRole, removeParticipant, subscribe } from '../../../utils/twilio';
import { useAppContext } from '../../../contexts/AppContext';
import { useSharedRoomState } from '../../../contexts/SharedRoomContext';
import useRemoteTracks from '../../../hooks/useRemoteTracks';
import useMeeting from '../../../hooks/useMeeting';
import HelpMeIcon from '@material-ui/icons/ContactSupportOutlined';
import AllGoodIcon from '@material-ui/icons/ThumbUpOutlined';

interface FOHControlsProps {
  participant: Participant;
}

export default function FOHControls({ participant }: FOHControlsProps) {
  const [{ room }] = useAppContext();
  const [{ admitted, rejected, meetings, helpNeeded }, changeSharedState] =  useSharedRoomState();
  const [waiting, setWaiting] = useState(false);
  const audioTracks = useRemoteTracks('audio');
  const me = room?.localParticipant;
  const { meeting } = useMeeting();

  if (!me || !isRole('foh')(me) || isRole('foh')(participant)) return null;

  const fohIdentity = me.identity || '';
  const { identity } = participant;

  const inMeeting = !!meeting;

  const audioTrack = audioTracks[identity]?.[0] as RemoteAudioTrack;
  const spying = !!audioTrack;

  const toggleMute = () => {
    setWaiting(true);
    subscribe(room?.name || '', fohIdentity, 'spy', spying ? [] : [identity])
      .finally(() => setWaiting(false));
  }

  const reject = () => {
    changeSharedState({ rejected: [...rejected, identity] });
    removeParticipant(participant, room).then();
  }

  const toggleApproved = () =>
    changeSharedState({ admitted: toggleMembership(admitted || [])(identity) });

  const toggleMeeting = () => {
    const newMeetings = inMeeting
      ? meetings.filter((group) => !group.includes(identity))
      : [...meetings, [identity, fohIdentity]];
    changeSharedState({ meetings: newMeetings });
  }

  const approved = inGroup(admitted)(participant);
  const needsHelp = helpNeeded.includes(identity) && !approved && !inMeeting;

  return  (
    <>
    <div style={{ width: '100%', textAlign: 'right' }}>
      { waiting
        ? <CircularProgress size={20} />
        : (
          <Button onClick={toggleMute}>
            { spying ? <CameraIcon /> : <CameraOffIcon /> }
            <AudioLevelIndicator audioTrack={audioTrack} background={'white'} />
          </Button>
        ) }
    </div>
      <div style={{ width: '100%', textAlign: 'right' }}>
        <Button
          onClick={toggleMeeting}
          size="small" color={needsHelp ? 'primary' : 'secondary'} variant="contained"
        >
          { needsHelp ? 'help!' : `${inMeeting ? 'end' : 'start'} meeting` }
        </Button>
      </div>
    <div style={{ opacity: '90%' }}>
      <div style={{ float: 'right' }}>
        <Button
          onClick={toggleApproved}
          size="small" variant="contained"
          style={approved ? { color: 'white', background: 'green' } : {}}
          endIcon={approved ? <VerifiedIcon style={{ color: 'white', border: 'none' }}/> : null}
        >
          { approved ? 'Approved' : 'Approve' }
        </Button>
      </div>
      <div>
        <Button
          onClick={reject}
          size="small" color="secondary" variant="contained">
          Reject
        </Button>
      </div>
    </div>
      </>
  )
}
