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
const matchSid = (p1) => (p2) => p1.sid === p2.sid;

export function SelectedParticipantsProvider({ room, children }: SelectedParticipantsProviderProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const toggleSelectedParticipant = (participant: Participant) => {
    console.log('selectedParticipants', selectedParticipants.map((p) => p.sid));
    console.log('toggling', participant.sid);
    return setSelectedParticipants(selectedParticipants.find(matchSid(participant))
      ? selectedParticipants.filter(not(matchSid(participant)))
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
