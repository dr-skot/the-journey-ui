import LocalVideoPreview from './LocalVideoPreview';
import SignInBar from './SignInBar';
import React, { useState } from 'react';
import { defaultRoom, UserRole } from '../../utils/twilio';
import { Settings } from '../../contexts/settings/settingsReducer';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

interface SignInProps {
  roomName?: string,
  role?: UserRole,
  options?: Partial<Settings>
}

export default function SignIn({ roomName = defaultRoom(), role = 'audience', options = {} }: SignInProps) {
  const [hasBeenWelcomed, setHasBeenWelcomed] = useState(false);

  const closeDialog = () => setHasBeenWelcomed(true);

  return (
    <>
      <SignInBar roomName={roomName} role={role}
                 options={options} />
      <LocalVideoPreview />
      <Dialog open={!hasBeenWelcomed} onClose={closeDialog}>
        <DialogTitle id="alert-dialog-title">Welcome to The Journey</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please make sure your camera and microphone are working.
            You should see yourself in this window, and the microphone
            icon in the top corner should have green in it that bounces
            up and down as you talk.
          </DialogContentText>
          <DialogContentText>
            If not, click the gear icon and change your settings.
          </DialogContentText>
          <DialogContentText>
            And for the best experience, we recommend listening with earphones.
          </DialogContentText>
          <DialogContentText>
            When you're ready, type in your name and hit enter!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary" variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
