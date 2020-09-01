import React, { createContext, useContext, useState, useEffect } from 'react';
import { Participant, Room } from 'twilio-video';

type selectedParticipantsContextType = [Participant[], (participant: Participant) => void];

export const selectedParticipantsContext = createContext<selectedParticipantsContextType>(null!);

export default function useSelectedParticipants() {
  const [selectedParticipants, toggleSelectedParticipant] = useContext(selectedParticipantsContext);
  return [selectedParticipants, toggleSelectedParticipant] as const;
}

type SelectedParticipantsProviderProps = {
  room: Room;
  children: React.ReactNode;
};

// @ts-ignore
const not = (f) => (...args) => !f(...args);
// @ts-ignore
const propsEqual = (prop) => (a) => (b) => a[prop] === b[prop];

export function SelectedParticipantsProvider({ room, children }: SelectedParticipantsProviderProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const toggleSelectedParticipant = (participant: Participant) => {
    return setSelectedParticipants(selectedParticipants.find(propsEqual('sid')(participant))
      ? selectedParticipants.filter(not(propsEqual('sid')(participant)))
      : [...selectedParticipants, participant]);
  }

  useEffect(() => {
    const onDisconnect = () => setSelectedParticipants([]);
    room.on('disconnected', onDisconnect);
    return () => {
      room.off('disconnected', onDisconnect);
    };
  }, [room]);

  return (
    <selectedParticipantsContext.Provider value={[selectedParticipants, toggleSelectedParticipant]}>
      {children}
    </selectedParticipantsContext.Provider>
  );
}
