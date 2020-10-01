import { Redirect } from 'react-router-dom';
import React from 'react';

function replaceFirstPathSegment(path: string, newSegment: string) {
  const firstPathSegment = path.match(/^\/[^/]+/)?.[0];
  return firstPathSegment ? path.replace(firstPathSegment, newSegment) : path;
}

interface SafeRedirectProps {
  to: string,
  push?: boolean,
}
export default function SafeRedirect({ push, to }: SafeRedirectProps) {
  return <Redirect push={push} to={{
    ...window.location,
    pathname: replaceFirstPathSegment(window.location.pathname, to)
  }}
  />
}
