import React, { useEffect, useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { timezones } from '../../utils/codes';

const currentZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const currentCountry = currentZone && currentZone.split('/')[0]
const zones = [...timezones].sort((a, b) => {
  if (currentZone && currentZone === a) return -1;
  if (currentCountry && (a.includes(currentCountry) && !b.includes(currentCountry))) return -1;
  return 0
});

interface TimezonePickerProps {
  id?: string,
  onChange?: (timezone: string) => void,
}

const TimezonePicker = ({ id, onChange }: TimezonePickerProps) => {
  const [input, setInput] = useState<string>(currentZone);
  function handleChange(e: React.ChangeEvent<{ value: unknown }>) {
    setInput(e.target.value as string);
  }

  // fire onChange initially, and when input changes
  useEffect(() => onChange?.(input), [input, onChange]);

  return (
    <Select id={id} onChange={handleChange} value={input}>
      {zones.map(timezone => (
        <MenuItem key={timezone} value={timezone}>
          {timezone}
        </MenuItem>
      ))}
    </Select>
  )
}

export default TimezonePicker
