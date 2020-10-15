import React, { useCallback, useEffect, useState } from 'react';
import { getLocalTracks, joinRoom, publishTracks } from '../../utils/twilio';
import { LocalAudioTrack, LocalVideoTrack, Room } from 'twilio-video';
import { Button } from '@material-ui/core';
import { Twilio } from '../../../App';
import { useTwilioRoomContext } from '../../contexts/TwilioRoomContext';

const ROOM_NAME = 'jzrfcrk';

export default function TwilioMin() {
  return <>
    { true ? <SimpleJoin/> : <JoinInApp/> }
    <MillicastMin/>
  </>
}

function JoinInApp() {
  return <Twilio>
    <JoinInTwilio/>
  </Twilio>;
}

function JoinInTwilio() {
  const [{ room }, dispatch] = useTwilioRoomContext();

  const toggleJoin = useCallback(() => {
    if (room?.state === 'connected') { room.disconnect() }
    else dispatch('joinRoom', { username: 'min', role: 'audience' });
  }, [room, dispatch]);

  return <>
    <h1>{ room?.state === 'connected' ? 'Joined Room In App' : 'Join Room?' }</h1>
    <Button onClick={() => dispatch('getLocalTracks')}>
      get tracks
    </Button>
    <Button onClick={toggleJoin}>
      { room?.state === 'connected' ? 'leave' : 'join' }
    </Button>
  </>;

}

const toggle = (prev: boolean) => !prev;

function SimpleJoin() {
  const [room, setRoom] = useState<Room>();
  const [unpublished, setUnpublished] = useState(false);
  const [, render] = useState(false);

  console.log('SimpleJoin', { tracks: room?.localParticipant.tracks.size });

  useEffect(() => {
    if (!room) return
    const rerender = () => render(toggle);
    room.localParticipant.on('trackPublished', rerender);
    room.localParticipant.on('trackUnpublished', rerender);
    return () => {
      room.localParticipant.off('trackPublished', rerender);
      room.localParticipant.off('trackUnpublished', rerender);
    }
  }, [room]);

  const toggleJoin = useCallback(() => {
    if (room) {
      unpublish();
      room.disconnect();
      setRoom(undefined);
    }
    else joinRoom(ROOM_NAME, 'min|lurker|1').then((room) => {
      setRoom(room);
    });
    }, [room, setRoom]);

  const publish = useCallback(() => {
    if (!room) return;
    getLocalTracks().then((tracks) => {
      publishTracks(room, tracks);
      setUnpublished(false);
    });
  }, [room])

  const unpublish = useCallback(() => {
    if (!room) return;
    room.localParticipant.tracks.forEach((pub) => {
      const track = pub.track as LocalAudioTrack | LocalVideoTrack;
      track.stop();
      track.disable();
      room.localParticipant.unpublishTrack(pub.track);
      setUnpublished(true);
    });
  }, [room]);

  const published = !unpublished && room
    ? Array.from(room.localParticipant.tracks.values())
      .some((pub) =>
        (pub.track as LocalAudioTrack | LocalVideoTrack).isEnabled)
    : false;

  return <>
    <h1>Room { room ? 'Joined' : 'Not Joined' }</h1>
    <h1>Media { published ? 'Published' : 'Not Published' }</h1>
    <Button onClick={toggleJoin}>
      { room ? 'leave' : 'join' }
    </Button>
    { room && (!published
      ? <Button onClick={publish}>publish</Button>
      : <Button onClick={unpublish}>unpublish</Button>) }
  </>;
}

function MillicastMin() {
  return <div style={{ height: '100vh', width: '100%', background: 'red' }}>
    <iframe
      title={'The Journey'}
      src={'/millicast-stereo/viewer.html'}
      allowFullScreen
      width="100%" height="100%"
    />
  </div>;
}
