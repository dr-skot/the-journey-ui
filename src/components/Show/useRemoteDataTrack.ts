import { useEffect, useState } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Room } from 'twilio-video';
const { values } = Object;

// TODO share this with JoinGallery
const ADMIN_SID = 'admin-user';

export default function useRemoteDataTracks(messageCallback: (data: string) => void) {
  const { room } = useVideoContext();
  room.on('trackSubscribed', (track) => {
    if (track.kind === 'data') {
      console.log('subscribed!');
      track.on('message', messageCallback);
    }
  });
}
