// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouteMatch, match } from 'react-router-dom';

export default function useCode() {
  const match = useRouteMatch() as match<{ code?: string }>;
  return match.params.code;
}
