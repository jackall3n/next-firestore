import { firestore } from "firebase-admin";
import { useCollection, useDocument } from "../hooks";
import { serialize } from "./serialization";
import { Firestore } from "@firebase/firestore";

export function getCollection<T>(name: string) {
  return {
    async get(admin: firestore.Firestore) {
      const reference = admin.collection(name)
      const data = await reference.get();

      return {
        [name]: data.docs.map(doc => serialize({
          id: doc.id,
          reference: doc.ref,
          collection: reference,
          exists: doc.exists || false,
          ...doc.data(),
        }))
      }
    },
    useData(db: Firestore) {
      const [data, reference] = useCollection<T>(db, name);

      return [data, reference] as const;
    },
  }
}

export function getDocument<T>(name: string) {
  return {
    async get(id: string, admin: firestore.Firestore) {
      const path = `${name}/${id}`;
      const reference = admin.doc(path);
      const data = await reference.get();

      return {
        [path]: serialize({
          id: reference.id,
          reference,
          exists: data.exists || false,
          ...data.data(),
        })
      }
    },
    useData(db: Firestore, id: string) {
      const path = `${name}/${id}`;

      const [data, reference] = useDocument<T>(db, path);

      return [data, reference] as const;
    },
  }
}
