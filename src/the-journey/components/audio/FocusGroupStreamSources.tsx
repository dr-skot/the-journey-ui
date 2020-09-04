import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import StreamSource from './StreamSource';
import { uniqKey } from '../../utils/react-help';
import { getStar } from '../../utils/twilio';

export default function FocusGroupStreamSources() {
  const [{ participants, focusGroup, audioTracks }] = useContext(AppContext);
  const starIdentity = getStar(participants)?.identity;

  return (
    <>
      { Array.from(audioTracks.entries())
      .filter(([identity]) => focusGroup.includes(identity) || identity === starIdentity)
      .flatMap(([, publications]) =>
        Array.from(publications.values())
          .map(({ track }) => track && <StreamSource key={uniqKey()} track={track}/>)
      ) }
    </>
  );
}
