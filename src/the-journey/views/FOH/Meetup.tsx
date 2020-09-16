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
type Identity = Participant.Identity;

interface MeetupProps {
  group: Identity[],
}

export default function Meetup({ group }: MeetupProps) {
  const [, dispatch] = useAppContext();
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const meeters = sortBy(
    useParticipants('includeMe').filter(inGroup(group)),
    (p) => isRole('foh')(p) ? 1 : 0
  );

  useEffect(() => {
    dispatch('subscribe', { profile: 'focus', focus: group });
    setUnmutedGroup(group);
  },[group]);

  return (
    <MenuedView>
      <FlexibleGallery participants={meeters}/>
      <Chat/>
      <Controls />
    </MenuedView>
  );
}

