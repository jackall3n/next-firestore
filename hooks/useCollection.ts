import { useEffect, useMemo, useState } from "react";
import { collection, CollectionReference, onSnapshot, query } from "@firebase/firestore";
import { pullAt } from "lodash";

import { useDefaultValue, useFirestoreApp } from "../providers";
import { IDocument } from "../types";
import { deserialize } from "../utils";

export function useCollection<T>(name: string) {
  const app = useFirestoreApp();

  const defaultValue = useDefaultValue<IDocument<T>[]>(name, []);

  const [data, setData] = useState<IDocument<T>[]>(defaultValue.map(v => deserialize(app, v)));

  const reference = useMemo(() => collection(app, name) as CollectionReference<T>, [name])

  useEffect(() => {
    const q = query<T>(reference);

    return onSnapshot(q, (snapshot) => {
      setData((data) => {
        const updated = [...data];

        for (const change of snapshot.docChanges()) {
          const { doc, type } = change;

          const index = updated.findIndex((d) => d.id === doc.id);

          switch (type) {
            case "added":
            case "modified": {
              const item = {
                id: doc.id,
                reference: doc.ref,
                exists: doc.exists(),
                ...doc.data(),
              };

              if (index === -1) {
                updated.push(item);
              } else {
                updated[index] = item;
              }

              break;
            }
            case "removed": {
              if (index === -1) {
                break;
              }

              pullAt(updated, index);

              break;
            }
          }
        }

        return updated;
      });
    });
  }, [reference]);

  return [data, reference] as const;
}
