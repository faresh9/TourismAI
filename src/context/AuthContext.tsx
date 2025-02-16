// filepath: /c:/Users/fares/Documents/GitHub/TourismAI/src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import  supabase  from '@/supabaseClient';


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

const [user, setUser] = useState(null);

useEffect(() => {
  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  };
  }, []);



return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;

};
export const useAuth = () => {
    return useContext(AuthContext);
  };
