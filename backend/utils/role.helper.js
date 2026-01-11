const isAdmin = (user) => {
  return user && ["admin", "superadmin"].includes(user.role);
};
