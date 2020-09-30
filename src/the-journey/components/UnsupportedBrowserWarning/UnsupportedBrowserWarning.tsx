import React from 'react';
import Video from 'twilio-video';
import SimpleMessage from '../../views/SimpleMessage';

export default function({ children }: { children: React.ReactElement }) {

  if (!Video.isSupported || !Array.prototype.flatMap) {
    return (
      <SimpleMessage
        title="Uh oh! This browser isn’t supported"
        paragraphs={[
          <>THE JOURNEY is best experienced in the latest versions <br/>of Chrome, Edge, Firefox, and Safari.</>,
          <>Please revisit us using one of those. Thank you and sorry for the inconvenience!</>,
          ]}
      />
    );
  }

  return children;
}
