import { createContext, PropsWithChildren, useContext } from "react";
import { Firestore } from "@firebase/firestore";

export const FirestoreAppContext = createContext<Firestore>(undefined);

export function useFirestoreApp() {
  return useContext(FirestoreAppContext);
}

export function FirestoreAppProvider({ app, children }: PropsWithChildren<{ app: Firestore }>) {
  return (
    <FirestoreAppContext.Provider value={app}>
      {children}
    </FirestoreAppContext.Provider>
  )
}
