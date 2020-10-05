import useOperatorControls, { KEYS } from './hooks/useOperatorControls';
import React from 'react';
import FlexibleGallery, { FlexibleGalleryProps } from '../Gallery/FlexibleGallery';
import MenuBar from '../../components/MenuBar/MenuBar';
import { GALLERY_SIZE } from '../Gallery/FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import { cached } from '../../utils/react-help';
import useRerenderOnTrackSubscribed from '../../hooks/useRerenderOnTrackSubscribed';
import WithFacts from '../Facts/WithFacts';
import Subscribe from '../../subscribers/Subscribe';
import { useAppState } from '../../contexts/AppStateContext';
import usePagedAudience, { twoPageSplit } from '../Gallery/usePagedAudience';

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

const half = (n: number) => Math.ceil(n / 2);

function OperatorView() {
  useRerenderOnTrackSubscribed();
  const [{ focusGroup }] = useAppState();
  const { toggleFocus } = useOperatorControls();
  const { gallery, paged, pageNumber, hideBlanks, menuButtons } = usePagedAudience();

  const galleryProps = {
    participants: gallery,
    selection: focusGroup,
    fixedLength: hideBlanks ? undefined : paged ? half(GALLERY_SIZE) : GALLERY_SIZE,
    hotKeys: paged ? twoPageSplit(pageNumber, KEYS.split('')).join('') : KEYS,
    onClick: toggleFocus,
  };

  const final = cached('Operator.galleryProps').ifEqual(galleryProps) as FlexibleGalleryProps;

  return (
    <Container>
      <Subscribe profile="data-only" />
      <MenuBar extras={menuButtons}/>
      <Main>
        <FlexibleGallery
          participants={final.participants}
          selection={final.selection}
          fixedLength={final.fixedLength}
          hotKeys={final.hotKeys}
          onClick={final.onClick}
          muteControls={true}
        />
      </Main>
    </Container>
  );
}


export default function Operator() {

  return (
      <WithFacts>
        <OperatorView />
      </WithFacts>
  );
}
