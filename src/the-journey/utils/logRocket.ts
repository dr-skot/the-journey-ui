import { random } from 'lodash';
import LogRocket from 'logrocket';

export function logRocketIdentify(username: string, role: string) {
  const suffix = localStorage.getItem('random') || `${random(0, 10000)}`;
  localStorage.setItem('random', suffix);
  LogRocket.identify(`${username}-${suffix}`, {
    role: role,
    userAgent: navigator.userAgent,
  });
}
