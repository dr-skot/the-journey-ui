import LocalVideoPreview from './components/LocalVideoPreview';
import SignInBar from './components/SignInBar';
import React from 'react';

interface SignInProps {
  roomName: string,
}

export default function SignIn({ roomName }: SignInProps) {
  return (
    <>
      <SignInBar roomName={roomName} />
      <LocalVideoPreview />
    </>
  )
}
