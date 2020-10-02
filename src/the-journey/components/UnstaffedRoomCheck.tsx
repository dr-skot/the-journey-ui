import React, { ReactNode } from 'react';
import { useTwilioRoomContext } from '../contexts/TwilioRoomContext';
import { isStaffed } from '../utils/twilio';
import { Messages } from '../messaging/messages';

export default function StaffCheck({ children }: { children: ReactNode }) {
  const [{ room }] = useTwilioRoomContext();
  return room && !isStaffed(room) ? Messages.UNSTAFFED_ROOM : <>{ children }</>;
}
