import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';

const LogoutButton = ({ className = "", variant = "outline", ...props }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={className}
      icon="LogOut"
      {...props}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;