import ParticipantVideoWindow from '../../../components/Participant/ParticipantVideoWindow';
import React from 'react';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../../hooks/useParticipants/useParticipants';
import { isRole } from '../../../utils/twilio';

const SIGN_LANGUAGE_WINDOW_SIZE = {
  width: 16 * 20,
  height: 9 * 20,
}

const SignLanguageWindow = styled('div')(() => ({
  position: 'absolute',
  bottom: 70,
  right: 10,
  width: SIGN_LANGUAGE_WINDOW_SIZE.width,
}));

export default function SignLanguageInterpreter() {
  const participants = useParticipants('includeMe');
  const signInterpreter = participants.find(isRole('sign-interpreter'));

  if (!signInterpreter) return null;

  return (
    <SignLanguageWindow>
      <ParticipantVideoWindow
        participant={signInterpreter}
        { ...SIGN_LANGUAGE_WINDOW_SIZE }
      />
    </SignLanguageWindow>
  )
}
