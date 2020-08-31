import { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function SubscribeToAllAudio() {
  const [{ room, focusGroup }, dispatch] = useContext(AppContext);

  useEffect(() =>
      dispatch('subscribe', { profile: 'listen', focus: focusGroup }),
    [room, focusGroup]);
}
