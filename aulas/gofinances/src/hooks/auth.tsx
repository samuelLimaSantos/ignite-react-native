import React, { createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface ContextData {
  user: User;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({} as ContextData);

const AuthProvider = ({ children }: AuthProviderProps ) => {

  const user = {
    id: '1',
    name: 'John Doe',
    email: 'jondoe@gmail.com'
  }

  return (
    <AuthContext.Provider value={{ user }}>
      { children }
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const auth = useContext(AuthContext);

  return auth;
};


export { AuthProvider, useAuth };