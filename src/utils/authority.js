export function getAuthority() {
  const authorityString = localStorage.getItem('authority');

  let authority;

  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export function getPermission(per) {
  const permissionString = localStorage.getItem('permission');

  try {
    const permissions = JSON.parse(permissionString);
    return !!permissions.includes(per);
  } catch (e) {
    return false;
  }
}

export function setAuthority(authority) {
  const Authority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('authority', JSON.stringify(Authority));
}

export function setPermission(permission) {
  const Permission = typeof permission === 'string' ? [permission] : permission;
  return localStorage.setItem('permission', JSON.stringify(Permission));
}
