import LocalVideoPreview from './components/LocalVideoPreview';
import SignInBar from './components/SignInBar';
import React from 'react';
import { defaultRoom, UserRole } from '../../utils/twilio';

interface SignInProps {
  roomName?: string,
  role?: UserRole,
}

export default function SignIn({ roomName = defaultRoom(), role = 'audience' }: SignInProps) {
  return (
    <>
      <SignInBar roomName={roomName} role={role} />
      <LocalVideoPreview />
    </>
  )
}
