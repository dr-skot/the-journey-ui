import React from 'react';
import { codeToTime, diff, format, punctuality } from '../../utils/foh';
import moment from 'moment';

export default function Lobby(props: { match: { params: { code: string; }; }; }) {
  const code = props.match.params.code;
  console.log('code', code);
  const curtain = moment(codeToTime(code));
  const arrival = moment();
  const display = format(curtain);
  const punct = punctuality(curtain, arrival);
  console.log('arrival', { curtain, arrival, diff: diff(curtain, arrival)});
  return (
    <div>
      <h1>I'm the lobby</h1>
      <p>You're {punct}!</p>
      <p>Show {punct.match(/late/) ? 'started' : 'starts'} at {display.time} on {display.day}</p>
    </div>
  )
}
