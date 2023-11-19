// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { buildQueryString } from '../util';

interface User {
  id: number;
  registered: Date;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  adminNotes?: string;
}

interface UserProviderProps {   
  children: ReactNode;
}

interface UserContextProps {
  users: User[];
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  fetchMoreUsers: (search: string) => Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>();
  const [loading, setLoading] = useState(true);
  const [after, setAfter] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  let userID = 0

  const fetchMoreUsers = async (Search: string) => {
    
    setLoading(true);
    try {
        const queryParams = {
            search : Search,
            after : userID
        };

        const query = buildQueryString(queryParams);
        const response = await fetch(`/api/all-users?${query}`);
        const newUsersResponse = await response.json();
        const newUsers = newUsersResponse.data;
    
        setUsers((prevUsers) => {
          return [...(prevUsers || []), ...newUsers];
        });
        userID += newUsers.length
    } catch (error) {
        
    } finally {
        setLoading(false)
    }
  };
  
  const addUser = async (user: User) => {
    // API call or logic to add a user
    // Then, update the state:
    setUsers(prevUsers => [...prevUsers, user]);
  };

  const updateUser = async (user: User) => {
    // API call or logic to update the user
    // Then, update the state:
    setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? user : u));
  };

  const deleteUser = async (id: number) => {
    // API call or logic to delete the user
    // Then, update the state:
    setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, search, setSearch, updateUser, deleteUser, loading, setUsers, fetchMoreUsers }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
