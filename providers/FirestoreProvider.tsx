import React, { createContext, PropsWithChildren, useContext } from "react";

export type IFirestoreContextValue = any;
export type IFirestoreContext = Record<string, IFirestoreContextValue>;

export const FirestoreContext = createContext<IFirestoreContext>({});

export function useDefaultValue<T extends IFirestoreContextValue>(key: string): T | undefined;
export function useDefaultValue<T extends IFirestoreContextValue>(key: string, defaultValue: T): T;
export function useDefaultValue<T extends IFirestoreContextValue>(key: string, defaultValue?: T): T | undefined {
  const values = useFirestoreContext();

  return values?.[key] ?? defaultValue
}

export function useFirestoreContext() {
  return useContext(FirestoreContext);
}

export default function FirestoreProvider({ values, children }: PropsWithChildren<{ values: IFirestoreContext }>) {
  return (
    <FirestoreContext.Provider value={values}>
      {children}
    </FirestoreContext.Provider>
  )
}
