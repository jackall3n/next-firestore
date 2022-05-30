import { DocumentReference } from "@firebase/firestore";

export type IDocument<T> = T & {
  id: string;
  reference: DocumentReference<T>;
  exists: boolean;
};
