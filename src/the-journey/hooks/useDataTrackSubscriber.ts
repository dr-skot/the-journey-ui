import { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';

export default function useDataTrackSubscriber() {
  const [{ room }, dispatch] = useContext(AppContext);
  useEffect(() => { if (room) dispatch('subscribe') }, [room]);
}
