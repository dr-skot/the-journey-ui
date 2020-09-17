import React, { useContext, useEffect } from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { inGroup, isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { useAppContext } from '../../contexts/AppContext';
import MenuedView from '../Gallery/MenuedView';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import Chat from './components/Chat/Chat';
import Controls from '../../components/Controls/Controls';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import { useSharedRoomState } from '../../contexts/SharedRoomContext';
type Identity = Participant.Identity;

interface MeetingProps {
  group: Identity[],
}

export default function Meeting({ group }: MeetingProps) {
  const [, dispatch] = useAppContext();
  const [{ meetings }, changeSharedState] = useSharedRoomState();
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const meeters = sortBy(
    useParticipants('includeMe').filter(inGroup(group)),
    (p) => isRole('foh')(p) ? 1 : 0
  );

  if (meeters.length === 1) { // get out of the "meeting"
    const newMeetings = meetings.filter((group) => !group.includes(meeters[0].identity))
    changeSharedState({ meetings: newMeetings });
  }

  useEffect(() => {
    dispatch('subscribe', { profile: 'focus', focus: group });
    setUnmutedGroup(group);
  },[group]);

  // TODO with facts?
  return (
    <MenuedView>
      <FlexibleGallery participants={meeters}/>
      <Chat/>
      <Controls />
    </MenuedView>
  );
}
