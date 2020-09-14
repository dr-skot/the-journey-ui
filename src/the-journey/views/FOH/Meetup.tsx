import useParticipants from '../../hooks/useParticipants/useParticipants';
import { inGroup } from '../../utils/twilio';
import MenuedView from '../Gallery/MenuedView';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import Chat from './components/Chat/Chat';
import Controls from '../../components/Controls/Controls';
import React from 'react';
import { Participant } from 'twilio-video';
type Identity = Participant.Identity;

interface MeetupProps {
  group: Identity[],
}

// TODO audience sees controls, foh sees menu
export default function Meetup({ group }: MeetupProps) {
  const meeters = useParticipants().filter(inGroup(group));
  return (
    <MenuedView>
      <FlexibleGallery participants={meeters}/>
      <Chat/>
      <Controls />
    </MenuedView>
  );
}
