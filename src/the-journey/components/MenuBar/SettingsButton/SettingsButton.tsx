import React, { useState, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import GearIcon from '@material-ui/icons/Settings';
import SettingsDialog from '../SettingsDialog/SettingsDialog';

export default function Menu() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={anchorRef}>
      <IconButton color="inherit" onClick={() => setSettingsOpen(state => !state)}>
        <GearIcon />
      </IconButton>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
