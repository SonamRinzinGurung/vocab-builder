import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

// "demo-" prefix means Firebase treats this as a local-only project —
// no real credentials or internet access required.
export const TEST_PROJECT_ID = 'demo-vocab-builder';


// Explicit allow-all rules for the query-correctness tests in vocabQueries.integration.test.js.
// Overrides whatever rules the emulator loaded at startup so unauthenticatedContext() can
// read and write freely. Those tests verify query logic, not permission enforcement.
const ALLOW_ALL_RULES = `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
`;

export async function createEmulatorEnv() {
    return await initializeTestEnvironment({
        projectId: TEST_PROJECT_ID,
        firestore: {
            host: 'localhost',
            port: 8080,
            rules: ALLOW_ALL_RULES,
        },
    });
}


// Used by firestoreRules.integration.test.js — loads firestore.rules so the
// emulator enforces authentication and ownership checks during tests.
export async function createEmulatorEnvWithRules() {
    return await initializeTestEnvironment({
        projectId: TEST_PROJECT_ID,
        firestore: {
            host: 'localhost',
            port: 8080,
            rules: readFileSync('firestore.rules', 'utf8'),
        },
    });
}
