import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Box, Button, Card, TextField, Typography } from '@material-ui/core';
import { timeToCode } from '../../utils/foh';
import moment from 'moment';

export default function GetCode() {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    // @ts-ignore
    const input = form.elements['showtime'].value;
    console.log(input);
    const date = moment(input);
    setCode(date.isValid() ? timeToCode(date.toDate()) : '');
    setError(date.isValid() ? '' : 'Invalid Date');
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Typography>
          {code && `Code: ${code}`}
        </Typography>
        <Typography>
          {error && `Error: ${error}`}
        </Typography>
        <TextField
          id="showtime"
          type="datetime-local"
          defaultValue={`2020-08-30T20:30`}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
        >
          Get Code
        </Button>

      </form>
    </Card>
    );
}
