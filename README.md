# next-firestore 🔥

<p>
<a href="https://www.npmjs.com/next-firestore"><img src="https://img.shields.io/npm/v/next-firestore.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/next-firestore"><img src="https://img.shields.io/npm/l/next-firestore.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/next-firestore"><img src="https://img.shields.io/npm/dm/next-firestore.svg" alt="NPM Downloads" /></a>
</p>

## Blurb

A library dedicated to supporting Firebase + server-side rendering.

## Installation

```shell
npm install next-firestore
```

```shell
yarn add next-firestore
```

## Setup

### _app.
```typescript jsx
import { getFirestore } from "@firebase/firestore";
import { FirestoreAppProvider } from "next-firestore";

const app = getFirestore()

function MyApp({ Component, pageProps }) {
  return (
    <FirestoreAppProvider app={app}>
      <Component {...pageProps} />
    </FirestoreAppProvider>
  )
}

export default MyApp
```

## Usage

### Collection

```typescript jsx
import admin from 'firebase-admin';
import { FirestoreProvider, useFirestoreApp } from 'next-firestore';

// Create fetchers for collections and documents
const fetchers = {
  projects: getCollection('projects')
}

function Page() {
  const { query } = useRouter();

  // Get client side data, and subscribe to live updates
  const [projects] = fetchers.projects.useData()

  return (
    <div>
      There are {projects.length} projects!
    </div>
  )
}

export default async function getServerSideProps(context) {
  // Get server side data
  const projects = await fetchers.projects.get(admin);

  return {
    props: {
      firebase: {
        ...projects
      }
    }
  }
}

export default (props) => {
  return (
    <FirestoreProvider value={props.firebase}>
      <Page />
    </FirestoreProvider>
  )
}
```

### Document

```typescript jsx
import admin from 'firebase-admin';
import { FirestoreProvider, useFirestoreApp } from 'next-firestore';

const fetchers = {
  project: getDocument('projects')
}

function Page() {
  const { query } = useRouter();

  const [project] = fetchers.project.useData(query.id)

  return (
    <div>
      {project.name}
    </div>
  )
}

export default async function getServerSideProps(context) {
  const id = context.query.id;

  const project = await fetchers.project.get(id, admin);

  return {
    props: {
      firebase: {
        ...project,
      }
    }
  }
}

export default (props) => {
  return (
    <FirestoreProvider value={props.firebase}>
      <Page />
    </FirestoreProvider>
  )
}
```
