import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import StreamSource from './StreamSource';
import { uniqKey } from '../../utils/react-help';

export default function FocusGroupStreamSources() {
  const [{ focusGroup, audioTracks }] = useContext(AppContext);

  console.log('FocusGroup stream sources renderage');

  return (
    <>
      { Array.from(audioTracks.entries())
      .filter(([identity]) => focusGroup.includes(identity))
      .flatMap(([, publications]) =>
        Array.from(publications.values())
          .map(({ track }) => track && <StreamSource key={uniqKey()} track={track}/>)
      ) }
    </>
  );
}
