import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import GearIcon from '@material-ui/icons/Settings';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import SettingsDialog from '../../MenuBar/SettingsDialog/SettingsDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function SettingsButton() {
  const classes = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
    <Tooltip title="Settings" onClick={() => setSettingsOpen(true)} placement="top"
             PopperProps={{ disablePortal: true }}>
      <Fab className={classes.fab}>
        <GearIcon />
      </Fab>
    </Tooltip>
    <SettingsDialog
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
    />
    </>
);
}
