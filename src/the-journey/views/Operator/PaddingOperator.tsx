import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { Participant } from 'twilio-video';
import useOperatorMessaging from './hooks/useOperatorMessaging';
import { styled } from '@material-ui/core/styles';

const Container = styled('div')({
  display: 'flex',
  flexFlow: 'column',
  height: '100%',
});

const Main = styled('div')({
  flex: '1 1 0',
  display: 'flex',
  height: '100%',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
});

export const inGroup = (group: string[]) => (p: Participant) => group.includes(p.identity);

export default function Operator() {
  const { forceGallery, forceHotKeys, toggleFocus, participants } = useOperatorControls({ withMuppets: true });
  const [{ focusGroup, starIdentity }, dispatch] = useContext(AppContext);
  useOperatorMessaging();

  const focusing = focusGroup.length && !forceGallery;

  const handleClick = (e: MouseEvent, participant: Participant) => {
    // TODO star's video priority should be high -- look at dominant speaker code
    if (e.altKey) dispatch('toggleStar', { starIdentity: participant.identity });
    else toggleFocus?.(participant);
  }


  return (
    <Container>
      <MenuBar isOperator/>
      <Main>
      <FlexibleGallery
        participants={(focusing ? participants?.filter(inGroup(focusGroup)) : participants) || []}
          selection={focusing ? [] : focusGroup}
        star={starIdentity}
        fixedLength={focusing ? undefined : GALLERY_SIZE}
        hotKeys={!focusing || forceHotKeys ? KEYS : ''}
        mute={true}
        onClick={handleClick}
      />
      </Main>
    </Container>
  );
}
