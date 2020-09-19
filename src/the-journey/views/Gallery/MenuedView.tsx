import React, { ReactNode } from 'react';
import MenuBar from '../../components/MenuBar/MenuBar';
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

interface MenuedViewProps {
  menuExtras?: ReactNode,
  children: ReactNode
}

export default function MenuedView({ menuExtras, children }: MenuedViewProps) {

  return (
    <Container>
      <MenuBar extras={menuExtras} />
      <Main>
        {children}
      </Main>
    </Container>
  );
}

