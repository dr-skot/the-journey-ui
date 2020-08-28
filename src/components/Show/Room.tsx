import React, { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SidebarSelfie from './SidebarSelfie';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSubscriber from '../../hooks/useSubscriber/useSubscriber';
import { RemoteDataTrack } from 'twilio-video';

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
  console.log('render Room')
  const { room } = useVideoContext();
  const participants = useParticipants();
  const [focusGroup, setFocusGroup] = useState<string[]>([]);
  const subscribe = useSubscriber();


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
        { participants.map((participant) => (
          <ParticipantTracks
            key={participant.sid}
            participant={participant}
          />
        )) }
      </Floater>
      <Main>
        <iframe title="broadcast"
          src="https://viewer.millicast.com/v2?streamId=wbfwt8/ke434gcy"
          allowFullScreen width="100%" height="100%"
        />
      </Main>
    </Container>
  );
}
