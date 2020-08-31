import useVideoContext from './useVideoContext';

export default function useJustRoom() {
  const { room } = useVideoContext();
  return room;
}
