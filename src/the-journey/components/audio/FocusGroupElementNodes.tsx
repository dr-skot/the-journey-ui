import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import AudioElementNode from './AudioElementNode';
import { uniqKey } from '../../utils/react-help';

export default function FocusGroupElementNodes() {
  const [{ focusGroup, audioTracks }] = useContext(AppContext);

  return (
    <>
      { Array.from(audioTracks.entries())
      .filter(([identity]) => focusGroup.includes(identity))
      .flatMap(([, publications]) =>
        Array.from(publications.values())
          .map(({ track }) => track && <AudioElementNode key={uniqKey()} track={track}/>)
      ) }
    </>
  );
}
