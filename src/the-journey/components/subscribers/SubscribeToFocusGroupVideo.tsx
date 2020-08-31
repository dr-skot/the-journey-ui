import { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function SubscribeToFocusGroupVideo() {
  const [{ room, focusGroup }, dispatch] = useContext(AppContext);

  useEffect(() =>
      dispatch('subscribe', { profile: 'focus', focus: focusGroup }),
    [room, focusGroup]);
}
