import { useEffect, useMemo, useState } from "react";
import { doc, DocumentReference, onSnapshot } from "@firebase/firestore";

import { deserialize } from "../utils";
import { useDefaultValue, useFirestoreApp } from "../providers";
import { IDocument } from "../types";

export function useDocument<T>(name: string) {
  const app = useFirestoreApp();

  const defaultValue = useDefaultValue<IDocument<T>>(name);

  const [data, setData] = useState<IDocument<T>>(deserialize(app, defaultValue));

  const reference = useMemo(() => doc(app, name) as DocumentReference<T>, [name])

  useEffect(() => {
    return onSnapshot(reference, (snapshot) => {
      if (!snapshot.exists()) {
        setData(undefined as any);
      }

      setData({
        id: snapshot.ref.id,
        reference,
        exists: snapshot.exists(),
        ...snapshot.data(),
      })
    });
  }, [reference]);

  return [data, reference] as const;
}
