import { collection, CollectionReference, doc, DocumentReference, Firestore } from "@firebase/firestore";

function isCollectionReference(value: any): value is CollectionReference<any> {
  return '_queryOptions' in value && isFirestoreObject(value);
}

function isFirestoreObject(value: any) {
  return '_firestore' in value
}

function isDocumentReference(value: any): value is DocumentReference<any> {
  return !isCollectionReference(value) && isFirestoreObject(value)
}

export function serialize(data: any) {
  if (!data) {
    return data;
  }

  return Object.entries(data).reduce((obj, [key, value]) => {
    const val = (() => {
      if (typeof value === 'undefined') {
        return null;
      }

      if (!value) {
        return value;
      }

      if (typeof value !== 'object') {
        return value;
      }

      if (isDocumentReference(value)) {
        return {
          __type: 'document',
          ref: value.path
        };
      }

      if (isCollectionReference(value)) {
        return {
          __type: 'collection',
          ref: value.path
        }
      }

      if (isFirestoreObject(data)) {
        return null;
      }

      try {
        console.log('serialized', key, JSON.stringify(value))

        return JSON.stringify(value);
      } catch (e) {
        console.log('failed', e, key, value)
      }

      return value
    })()

    return {
      ...obj,
      [key]: val
    }
  }, {})
}


export function deserialize(db: Firestore, data: any): any {
  if (!data) {
    return data;
  }

  return Object.entries(data).reduce((obj, [key, value]) => {

    const val = (() => {

      if (!value) {
        return value;
      }

      if (typeof value !== 'object') {
        return value;
      }

      const v = value as any;

      if ('__type' in v && v.__type === 'document') {
        return doc(db, v.ref);
      }

      if ('__type' in v && v.__type === 'collection') {
        return collection(db, v.ref);
      }

      return value
    })()

    return {
      ...obj,
      [key]: val
    }
  }, {})
}
