import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import AudioElement from './AudioElement';
import { uniqKey } from '../../utils/react-help';

export default function FocusGroupAudioElements() {
  const [{ focusGroup, audioTracks }] = useContext(AppContext);

  return (
    <>
      { Array.from(audioTracks.entries())
      .filter(([identity]) => focusGroup.includes(identity))
      .flatMap(([, publications]) =>
        Array.from(publications.values())
          .map(({ track }) => track && <AudioElement key={uniqKey()} track={track}/>)
      ) }
    </>
  );
}
