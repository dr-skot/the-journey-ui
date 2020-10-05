import { useEffect, useState } from 'react';

export default function useRerenderOnResize() {
  const [toggle, setToggle] = useState(false);

// rerender on resize
  useEffect(() => {
    const forceRender = () => setToggle((prev) => !prev);
    window.addEventListener('resize', forceRender);
    window.addEventListener('fullscreenchange', forceRender);
    return () => {
      window.removeEventListener('resize', forceRender);
      window.removeEventListener('fullscreenchange', forceRender);
    }
  }, [])

  return toggle;
}

