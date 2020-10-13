import React, { useState } from 'react';
import MenuButton from '../../components/MenuBar/MenuButton';
import useAudience from '../../hooks/useAudience/useAudience';
import { cached } from '../../utils/react-help';
import { Participant } from 'twilio-video';
import { GALLERY_COLUMN_COUNT, GALLERY_ORDERS } from '../../../constants';

interface PagedAudienceInfo {
  gallery: Participant[],
  paged: boolean,
  pageNumber: number,
  hideBlanks: boolean,
  menuButtons: React.ReactNode,
  order: number[],
}

export const twoPageSplit = (page: number, xs: any[]) => xs.filter((_, i) => i % 2 === page - 1);
export const columnSplit = (columns: number, page: number, xs: any[]) =>
  xs.filter((_, i) => Math.floor(2 * i / columns) % 2 === page - 1);

export default function usePagedAudience() {
  const [hideBlanks, ] = useState(false); // discontinued functionality
  const [paged, setPaged] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [orderIndex, setOrderIndex] = useState(0);

  const menuButtons = <>

    { paged && MenuButton(`${pageNumber === 2 ? 'page 1' : 'page 2'}`,
      () => setPageNumber((prev) => prev === 1 ? 2 : 1)) }

    { MenuButton(`${paged ? 'one page' : 'two pages'}`,
    () => setPaged((prev) => !prev)) }

    { MenuButton(`order ${orderIndex + 1}`,
      () => setOrderIndex((orderIndex + 1) % GALLERY_ORDERS.length)) }

    { /* MenuButton(`${hideBlanks ? 'show' : 'hide'} blanks`,
    () => setHideBlanks((prev) => !prev)) */ }

  </>;

  let gallery = useAudience();

  let order = GALLERY_ORDERS[orderIndex];
  if (paged) order = columnSplit(GALLERY_COLUMN_COUNT, pageNumber, order);

  return cached('pagedAudience')
    .ifEqual({ gallery, paged, pageNumber, hideBlanks, menuButtons, order }) as PagedAudienceInfo;
}
