import React, { useContext, useEffect } from 'react';
import { sortBy } from 'lodash';
import { Participant } from 'twilio-video';
import { inGroup, isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';
import MenuedView from '../MenuedView';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import Controls from '../../components/Controls/Controls';
import { useAppState } from '../../contexts/AppStateContext';
import useChat from '../../hooks/useChat';
import PlayAudioTracks from '../../components/audio/PlayAudioTracks';
import Subscribe from '../../subscribers/Subscribe';
type Identity = Participant.Identity;

interface MeetingProps {
  group: Identity[],
}

export default function Meeting({ group }: MeetingProps) {
  const [, roomStateDispatch] = useAppState();
  const meeters = sortBy(
    useParticipants('includeMe').filter(inGroup(group)),
    (p) => isRole('foh')(p) ? 1 : 0
  );
  const chat = useChat(meeters[1]?.identity || 'none');

  // TODO use meeting should handle this
  if (meeters.length === 1) { // get out of the "meeting" if there's only one of me
    roomStateDispatch('endMeeting', { meeting: meeters });
  }

  // TODO with facts?
  return (
    <MenuedView>
      <Subscribe profile="focus" focus={group}/>
      <PlayAudioTracks/>
      <FlexibleGallery participants={meeters}/>
      <Controls />
      { chat }
    </MenuedView>
  );
}

