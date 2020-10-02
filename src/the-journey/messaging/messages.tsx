import React from 'react';
import SimpleMessage from '../views/SimpleMessage';
import { ShowtimeData } from '../hooks/useShowtime';

export const Messages = {
  INVALID_CODE: <SimpleMessage
    title="Hmm..."
    paragraphs={[
      <>That doesn’t look like a valid show code.</>,
      <>Please contact the box office for a valid show address.</>
    ]}
  />,
  WRONG_TIME: ({ punct, doorPolicy, local, venue }: ShowtimeData) => <SimpleMessage
    title={`You’re ${punct}!`}
    paragraphs={[
      <>This show {punct.match(/late/) ? 'started' : 'starts'} at {local.time} on {local.day}.</>,
      <>{punct === 'early' && `Doors open ${doorPolicy.open} min before showtime.`}</>,
      <>{punct === 'too late' && venue.doorsClose && `Doors closed at ${venue.doorsClose}.`}</>,
    ]}
  />,
  UNSTAFFED_ROOM: <SimpleMessage
    title="Empty theater!"
    paragraphs={[
      <>There doesn’t seem to be a show running here.</>,
      <>Please contact the box office for a valid show address.</>,
    ]}
  />,
  TEST_ALL_GOOD: <SimpleMessage
    title="That’s all there is to it!"
    paragraphs={[
      <>We’ll see you at the show.</>
    ]}
  />,
  TEST_SORRY: <SimpleMessage
    title="Sorry you’re having trouble..."
    paragraphs={[
      <>
        You might have better luck in a different browser.
        THE JOURNEY is designed to run in the latest versions of
        Chrome, Firefox, Microsoft Edge, and Safari.
      </>,
      <>
        In any case, come back at showtime!
        Even if we can’t get your camera and mic hooked up,
        you will still be able to watch the show.
      </>
    ]}
  />

}

