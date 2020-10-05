import React, { useState } from 'react';
import MenuButton from '../../components/MenuBar/MenuButton';
import useAudience from '../../hooks/useAudience';
import { cached } from '../../utils/react-help';
import { Participant } from 'twilio-video';
import { getIdentities } from '../../utils/twilio';

interface PagedAudienceInfo {
  gallery: Participant[],
  paged: boolean,
  pageNumber: number,
  hideBlanks: boolean,
  menuButtons: React.ReactNode,
}

export const twoPageSplit = (page: number, xs: any[]) => xs.filter((_, i) => i % 2 === page - 1);

export default function usePagedAudience() {
  const [hideBlanks, setHideBlanks] = useState(false);
  const [paged, setPaged] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const menuButtons = <>
    { paged && MenuButton(`${pageNumber === 2 ? 'page 1' : 'page 2'}`,
      () => setPageNumber((prev) => prev === 1 ? 2 : 1)) }
    { MenuButton(`${paged ? 'one page' : 'two pages'}`,
    () => setPaged((prev) => !prev)) }
    { MenuButton(`${hideBlanks ? 'show' : 'hide'} blanks`,
    () => setHideBlanks((prev) => !prev)) }
    </>;

  let gallery = useAudience();
  console.log('all audience', getIdentities(gallery));
  if (paged) gallery = twoPageSplit(pageNumber, gallery);

  return cached('pagedAudience')
    .ifEqual({ gallery, paged, pageNumber, hideBlanks, menuButtons }) as PagedAudienceInfo;
}
