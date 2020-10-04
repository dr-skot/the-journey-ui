import React, { useContext, useEffect } from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { inGroup, isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import MenuedView from '../MenuedView';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import Controls from '../../components/Controls/Controls';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import { useAppState } from '../../contexts/AppStateContext';
import Chat from '../../components/Chat/Chat2';
import useChat from '../../hooks/useChat';
type Identity = Participant.Identity;

interface MeetingProps {
  group: Identity[],
}

export default function Meeting({ group }: MeetingProps) {
  const [{ localTracks }, dispatch] = useTwilioRoomContext();
  const [, roomStateDispatch] = useAppState();
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const meeters = sortBy(
    useParticipants('includeMe').filter(inGroup(group)),
    (p) => isRole('foh')(p) ? 1 : 0
  );
  const chat = useChat(meeters[1]?.identity || 'none');

  console.log('Meeting', { localTracks });

  if (meeters.length === 1) { // get out of the "meeting" if there's only one of me
    roomStateDispatch('endMeeting', { meeting: meeters });
  }

  useEffect(() => {
    dispatch('subscribe', { profile: 'focus', focus: group });
    setUnmutedGroup(group);
  },[group, setUnmutedGroup, dispatch]);

  // TODO with facts?
  return (
    <MenuedView>
      <FlexibleGallery participants={meeters}/>
      <Controls />
      { chat }
    </MenuedView>
  );
}

