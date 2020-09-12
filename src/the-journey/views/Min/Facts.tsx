import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { getIdentities, getRole, getTimestamp, getUsername, joinOptions } from '../../utils/twilio';
import { DateTime } from 'luxon';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { RemoteAudioTrack, RemoteParticipant, RemoteTrackPublication, RemoteVideoTrack } from 'twilio-video';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import { Button, styled } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { UnmuteButtons } from '../Testing/Testing';
import VideoTrack from '../../components/VideoTrack/VideoTrack';

const VideoWindow = styled('div')({
  display: 'inline-block',
  width: 160,
  height: 90,
  border: '1px solid black',
})

interface VideoPlayerProps { track: RemoteVideoTrack | null }
export function VideoPlayer({ track }: VideoPlayerProps) {
  const [showing, setShowing] = useState(false);

  return track
    ? (
      <>
        { showing && <VideoWindow><VideoTrack track={track}/></VideoWindow> }
        <Button onClick={() => setShowing(!showing)} variant="outlined">
          {`${showing ? 'hide' : 'show'} video`}
        </Button>
        </>
    ) : <span>null track</span>;
}

export default function Facts() {
  const [{ room, localTracks }] = useAppContext();
  const participants = useParticipants();
  useRerenderOnTrackSubscribed();

  if (!room) return null;
  const me = room.localParticipant;
  const name = getUsername(me.identity);
  const role = getRole(me);
  const timestamp = me
    ? DateTime.fromSeconds(parseInt(getTimestamp(me))).toFormat('h:mm:ss a')
    : '';

  const subscriptions: Record<string, RemoteTrackPublication[]> = {};

  const getSubscribedTracks = (p: RemoteParticipant) =>
    Array.from(p.tracks.values()).filter((pub: RemoteTrackPublication) => pub.kind !== 'data' && pub.isSubscribed);

  participants.forEach(p => {
    const subscribedTracks = getSubscribedTracks(p as RemoteParticipant);
    if (subscribedTracks.length > 0) {
      subscriptions[p.identity] = subscribedTracks;
    }
  })

  return (
    <div style={{margin: '2em'}}>
      <h1>Some Facts</h1>
      <h3>My name's [{name}]</h3>
      <h3>I'm user type [{role}] in a room called [{room.name}] that I joined at {timestamp}</h3>
      <h3>
        I see {participants.length} other participants in the room:
        {' ' + getIdentities(participants).map(getUsername).join(', ')}
      </h3>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h3>I'm subscribed to tracks from {Object.keys(subscriptions).length} participants</h3>
        </AccordionSummary>
        <AccordionDetails style={{flexDirection: 'column'}}>
          { Object.keys(subscriptions).map((identity) => (
            <SubscribedTracks key={identity} publisher={identity} pubs={subscriptions[identity]}/>
          )) }
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h3>I'm publishing {localTracks.length} tracks</h3>
        </AccordionSummary>
        <AccordionDetails>
          { localTracks.map((track) => (
            <>
              { track.kind === 'audio' ? '[audio]' : '[video]' }
              <pre>{JSON.stringify(track, null, 1)}</pre>
            </>
          )) }
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h3>I joined using these connection options</h3>
        </AccordionSummary>
        <AccordionDetails>
          <pre>{JSON.stringify(joinOptions, null, 1)}</pre>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

interface SubscribedTracksProps {
  publisher: string,
  pubs: RemoteTrackPublication[],
}
function SubscribedTracks({ publisher, pubs }: SubscribedTracksProps) {
  return (
    <>
    <h4>Published by {getUsername(publisher)}</h4>
      { pubs.map((pub) => {
        const track = pub.track;
        return track ? (
          <>
            { pub.kind === 'audio'
              ? <UnmuteButtons track={track as RemoteAudioTrack}/>
              : <VideoPlayer track={track as RemoteVideoTrack} /> }
            <pre key={publisher}>{JSON.stringify(pub, null, 1)}</pre>
          </>
        ) : '[null track]';
      }) }
    </>
  )
}

