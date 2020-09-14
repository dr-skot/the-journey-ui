import LocalVideoPreview from './components/LocalVideoPreview';
import SignInBar from './components/SignInBar';
import React from 'react';
import { defaultRoom, UserRole } from '../../utils/twilio';
import { Settings } from '../../contexts/settings/settingsReducer';

interface SignInProps {
  roomName?: string,
  role?: UserRole,
  options?: Partial<Settings>
}

export default function SignIn({ roomName = defaultRoom(), role = 'audience', options }: SignInProps) {
  return (
    <>
      <SignInBar roomName={roomName} role={role} options={options} />
      <LocalVideoPreview />
    </>
  )
}
