import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import MenuBar from '../Gallery/components/MenuBar';
import { GALLERY_SIZE } from '../Gallery/FixedGallery';
import { Participant } from 'twilio-video';
import useOperatorMessaging from './hooks/useOperatorMessaging';
import { styled } from '@material-ui/core/styles';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';

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
  const participants = useGalleryParticipants({ withMuppets: true });
  const { forceGallery, forceHotKeys, toggleFocus } = useOperatorControls({ withMuppets: true });
  const [{ focusGroup }, dispatch] = useContext(AppContext);
  useOperatorMessaging();

  const focusing = focusGroup.length && !forceGallery;

  return (
    <Container>
      <MenuBar isOperator/>
      <Main>
      <FlexibleGallery
        participants={(focusing ? participants?.filter(inGroup(focusGroup)) : participants) || []}
          selection={focusing ? [] : focusGroup}
        fixedLength={focusing ? undefined : GALLERY_SIZE}
        hotKeys={!focusing || forceHotKeys ? KEYS : ''}
        mute={true}
      />
      </Main>
    </Container>
  );
}
