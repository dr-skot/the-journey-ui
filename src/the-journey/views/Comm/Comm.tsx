import React from 'react';
import { getIdentities, isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import Subscribe from '../../subscribers/Subscribe';
import AutoJoin from '../../components/AutoJoin';
import WithFacts from '../Facts/WithFacts';
import PlayAllSubscribedAudio from '../../components/audio/PlayAllSubscribedAudio';
import Chat from '../../components/Chat/Chat';
import CenteredInWindow from '../../components/CenteredInWindow';
import ToggleAudioButton from '../../components/Controls/ToggleAudioButton/ToggleAudioButton';
import SettingsButton from '../../components/Controls/SettingsButton/SettingsButton';

export default function Comm() {
  const commUsers = getIdentities(useParticipants().filter(isRole('comm')));
  return <>
    <AutoJoin role="comm" withAudio/>
    <Subscribe profile="listen" focus={commUsers}/>
    <PlayAllSubscribedAudio/>
    <WithFacts>
      <CenteredInWindow><ToggleAudioButton/><SettingsButton/></CenteredInWindow>
      <Chat/>
    </WithFacts>
  </>
}

