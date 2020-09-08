import React, { useContext, useEffect } from 'react';
import useGalleryParticipants from '../Gallery/hooks/useGalleryParticipants';
import { getIdentities, inGroup, isRole, sameIdentities } from '../../utils/twilio';
import FlexibleGallery from '../Gallery/FlexibleGallery';
import { styled } from '@material-ui/core/styles';
import Controls from '../../components/Controls/Controls';
import { AudioStreamContext } from '../../contexts/AudioStreamContext/AudioStreamContext';
import { SharedRoomContext } from '../../contexts/SharedRoomContext';
import { not } from '../../utils/functional';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { cached } from '../../utils/react-help';
import Chat from './components/Chat/Chat';
import { Helmet } from 'react-helmet';
import { AppContext } from '../../contexts/AppContext';
import MenuedView from '../Gallery/MenuedView';

const Column = styled('div')(() => ({
  flex: '1 1 0',
  height: '100%'
}));


export default function Holding() {
  const foh = useParticipants('includeMe').filter(isRole('foh'));
  const gallery = useGalleryParticipants({ withMe: true, inLobby: true });
  const [{ room }] = useContext(AppContext);
  const { setUnmutedGroup } = useContext(AudioStreamContext);
  const [{ mutedInLobby }] = useContext(SharedRoomContext);

  // use cached deps if they haven't changed value
  const deps = {
    gallery: cached('Holding.gallery').if(sameIdentities)(gallery),
    foh: cached('Holding.foh').if(sameIdentities)(foh),
    mutedInLobby: cached('Holding.mutedInLobby').ifEqual(mutedInLobby),
  };

  // turn everybody's audio on (unless they're muted)
  useEffect(() => {
    const group = [...gallery, ...foh].filter(not(inGroup(mutedInLobby)));
    console.log('setting unmuted group to', getIdentities(group));
    setUnmutedGroup(getIdentities(group));
  }, [deps.gallery, deps.foh, deps.mutedInLobby]);

  const title = isRole('foh')(room?.localParticipant) ? 'FOH' : 'Lobby'

  return (
    <MenuedView>
      <Helmet><title>{title} : The Journey</title></Helmet>
      <Column style={{width: '50%'}}>
        <FlexibleGallery participants={gallery}/>
      </Column>
      <Column style={{width: '50%'}}>
        <FlexibleGallery participants={foh}/>
        <Chat/>
      </Column>
      <Controls />
    </MenuedView>
  )
}
