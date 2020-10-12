import React from 'react';
import SimpleMessage from '../views/SimpleMessage';
import { ShowtimeInfo } from '../hooks/useShowtime/useShowtime';
import { serverNow } from '../utils/ServerDate';
import { DEFAULT_DOOR_POLICY, formatTime } from '../utils/foh';

export const Messages = {
  INVALID_CODE: <SimpleMessage
    title="Hmm..."
    paragraphs={[
      <>That doesn’t look like a valid show code.</>,
      <>Please contact the box office for a valid show address.</>
    ]}
  />,
  WRONG_TIME: ({ curtain, open, close }: ShowtimeInfo) => {
    const now = serverNow();
    const late = now >= close;
    const wayTooLate = now > curtain.plus({ minutes: DEFAULT_DOOR_POLICY.close });
    const showtime = formatTime(curtain);
    return <SimpleMessage
      title={`You’re ${late ? 'too late' : 'early'}!`}
      paragraphs={[
        <>This show {late ? 'started' : 'starts'} at {showtime.time} on {showtime.day}.</>,
        <>
          { late
            ? !wayTooLate && `Doors closed at ${formatTime(close).time}.`
            : `Doors open at ${formatTime(open).time}` }
        </>,
      ]}
    />
  },
  UNSTAFFED_ROOM: <SimpleMessage
    title="Empty theater!"
    paragraphs={[
      <>There doesn’t seem to be a show running at this time.</>,
      <>Please double-check the date and time on your performance confirmation email
        and try again closer to showtime.</>,
      <>If you think that you are reaching this page in error, please contact the box office.
        We look forward to welcoming you to THE JOURNEY.</>,
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
        You might have better luck in a different browser. THE JOURNEY is designed to
        run in the latest versions of Chrome, Firefox, Microsoft Edge, and Safari.
      </>,
      <>
        Click <a target="_blank" href="/troubleshooting-tips.pdf">here</a> for troubleshooting tips.
      </>,
      <>
        If you have tried all the steps suggested in our tips and your camera or audio still isn't working,
        be sure to arrive early for the show, so we can test further at that time.
      </>,
      <>
        We look forward to welcoming you to THE JOURNEY.
      </>,
    ]}
  />

}

