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

## Usage

### Basic

```typescript jsx
import useQuery from 'next-firestore';
import admin from 'firebase-admin';
import { useFirestoreApp } from "./FirestoreAppProvider";

const fetchers = {
  projects: getCollection('projects'),
  project: getDocument('project')
}

function Page() {
  const [projects] = fetchers.projects.useData()

  return (
    <div>
      There are {projects.length} projects!
    </div>
  )
}

export default async function getServerSideProps() {
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
