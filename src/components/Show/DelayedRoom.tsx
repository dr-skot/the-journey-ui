import React, { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './SidebarSelfie';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSubscriber from '../../hooks/useSubscriber/useSubscriber';
import { RemoteDataTrack } from 'twilio-video';
import DelayedAudioTracks from '../ParticipantTracks/DelayedAudioTracks';
import { isDev } from '../../utils/react-help';
import useAudioSubscriber from '../../hooks/useAudioSubscriber/useAudioSubscriber';

const Container = styled('div')(() => ({
  position: 'relative',
  height: '100%',
}));

const Main = styled('div')(() => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
}));

const Floater = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: theme.sidebarWidth,
}));

export default function Room() {
  console.log('render delayed Room')
  const { room } = useVideoContext();
  const participants = useParticipants();
  const [focusGroup, setFocusGroup] = useState<string[]>([]);
  const subscribe = useSubscriber();
  useAudioSubscriber('delayed');

  // TODO move all this logic out of a rendering component
  console.log('participants', participants.length);
  console.log('focus group', focusGroup);

  useEffect(() => {
    const tracks: RemoteDataTrack[] =  [];
    const trackListener = (data: string) => {
      const newFocus = JSON.parse(data);
      setFocusGroup(newFocus);
      subscribe(room.name, room.localParticipant.identity, 'listen', newFocus);
    }
    const roomListener = (track: RemoteDataTrack) => {
      if (track.kind === 'data') {
        console.log('subscribed to data track!');
        tracks.push(track);
        track.on('message', trackListener);
      }
    };
    room.on('trackSubscribed', roomListener);
    return () => {
      room.removeListener('trackSubscribed', roomListener);
      tracks.forEach((track) => track.removeListener('message', trackListener));
    }
  }, [room, subscribe]);

  return (
    <Container>
      <Floater>
        <SidebarSelfie />
      </Floater>
      <Main>
        {!isDev() && (
            <iframe title="broadcast"
                src="https://viewer.millicast.com/v2?streamId=wbfwt8/ke434gcy"
                allowFullScreen width="100%" height="100%"
          />
        )}
      </Main>
    </Container>
  );
}
