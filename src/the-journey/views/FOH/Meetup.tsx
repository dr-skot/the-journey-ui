import React, { useEffect } from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { inGroup } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { useAppContext } from '../../contexts/AppContext';
import MenuedView from '../Gallery/MenuedView';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import Chat from './components/Chat/Chat';
import Controls from '../../components/Controls/Controls';
type Identity = Participant.Identity;

interface MeetupProps {
  group: Identity[],
}

// TODO audience sees controls, foh sees menu
export default function Meetup({ group }: MeetupProps) {
  const [, dispatch] = useAppContext();
  const meeters = sortBy(
    useParticipants('includeMe').filter(inGroup(group)),
    (p) => group.indexOf(p.identity)
  );

  useEffect(() =>
      dispatch('subscribe', { profile: 'focus', focus: group }),
    [group]);

  return (
    <MenuedView>
      <FlexibleGallery participants={meeters}/>
      <Chat/>
      <Controls />
    </MenuedView>
  );
}

