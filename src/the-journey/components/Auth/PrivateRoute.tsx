import React, { useState } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import Authorize from './Authorize';

interface PrivateRouteProps extends RouteProps {
  roles: string,
}

export default function PrivateRoute({ roles, children, ...rest }: PrivateRouteProps) {
  const [authorizedRole, setAuthorizedRole] = useState(sessionStorage.getItem('authorizedRole'));

  const onAuthSuccess = (role: string) => {
    sessionStorage.setItem('authorizedRole', role);
    setAuthorizedRole(role);
  }

  const renderChildren = authorizedRole && roles.split('|').includes(authorizedRole);

  // console.log('PrivateRoute', { renderChildren, authorizedRole })

  return (
    <Route
      {...rest}
      render={({ location }) =>
        renderChildren ? children : <Authorize roles={roles} onSuccess={onAuthSuccess}/>
      }
    />
  );
}
