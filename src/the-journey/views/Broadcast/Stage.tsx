import FlexibleGallery from '../Gallery/FlexibleGallery';
import React from 'react';
import { isRole, sameIdentities } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { cached } from '../../utils/react-help';
import { Participant } from 'twilio-video';

export default function Stage() {
  const star = useParticipants('includeMe').find(isRole('star'));
  const participants = cached('Stage').if(sameIdentities)([star]) as Participant[];
  return star ? <FlexibleGallery participants={participants}/> : null;
}
