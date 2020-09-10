import useStreamNodes from './useStreamNodes';
import { Participant } from 'twilio-video';
import { AudioOut } from '../../utils/audio';
import { useEffect, useState } from 'react';

type Identity = Participant.Identity;

interface Settings {
  muteAll: boolean,
  audioOut?: AudioOut,
  unmuteGroup: Identity[],
}

const initialSettings: Settings = {
  muteAll: false,
  audioOut: undefined,
  unmuteGroup: [],
}

export default function useNodeReconnector() {
  const nodes = useStreamNodes();
  const [settings, setSettings] = useState<Settings>(initialSettings)

  function unmuteGroup(unmuteGroup: Identity[], muteAll: boolean, audioOut?: AudioOut) {
    setSettings({ muteAll, audioOut, unmuteGroup } as Settings);
  }

  useEffect(() => {
    const { muteAll, audioOut, unmuteGroup } = settings;
    if (!audioOut) return;
    nodes.forEach(([identity, _, node]) => {
      if (!muteAll && unmuteGroup.includes(identity)) node.connect(audioOut.outputNode);
      else node.disconnect();
    });
  }, [settings, nodes]);

  return unmuteGroup;
}
