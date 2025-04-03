import React, { createContext, useContext, useEffect, useState } from 'react';
import { Organization } from '../Types/Organization';

interface OrganizationContextType {
  organization: Organization | null;
  setOrganization: React.Dispatch<React.SetStateAction<Organization | null>>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(() => {
    const storedOrganization = localStorage.getItem('organization');
    return storedOrganization ? JSON.parse(storedOrganization) : null;
  });

  useEffect(() => {
    if (organization) {
      localStorage.setItem('organization', JSON.stringify(organization));
    } else {
      localStorage.removeItem('organization');
    }
  }, [organization]);

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
