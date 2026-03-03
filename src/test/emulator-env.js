import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

// "demo-" prefix means Firebase treats this as a local-only project —
// no real credentials or internet access required.
export const TEST_PROJECT_ID = 'demo-vocab-builder';


export async function createEmulatorEnv() {
    return await initializeTestEnvironment({
        projectId: TEST_PROJECT_ID,
        firestore: {
            host: 'localhost',
            port: 8080,
        },
    });
}
