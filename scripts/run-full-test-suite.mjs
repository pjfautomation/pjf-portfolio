import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const nodeCommand = process.execPath;
const env = {
  ...process.env,
  NODE_ENV: 'test',
  APP_ENV: 'test',
  VITE_APP_ENV: 'test',
};

const checks = [
  { label: 'lint', command: npmCommand, args: ['run', 'lint'] },
  { label: 'build and typecheck', command: npmCommand, args: ['run', 'build'] },
  { label: 'replay workflow regression', command: nodeCommand, args: ['artifacts/verify-replay-workspace.cjs'] },
  { label: 'appointment care regression', command: nodeCommand, args: ['artifacts/verify-appointment-care.cjs'] },
  { label: 'client welcome regression', command: nodeCommand, args: ['artifacts/verify-client-welcome.cjs'] },
  { label: 'n8n receptionist regression', command: nodeCommand, args: ['artifacts/verify-n8n-receptionist.cjs'] },
  { label: 'basic RAG regression', command: nodeCommand, args: ['artifacts/verify-basic-rag.cjs'] },
  { label: 'HR assistant regression', command: nodeCommand, args: ['artifacts/verify-hr-assistant.cjs'] },
  { label: 'responsive shell regression', command: nodeCommand, args: ['artifacts/verify-responsive-shell.cjs'] },
  { label: 'workflow gallery regression', command: nodeCommand, args: ['artifacts/verify-workflow-library.cjs'] },
  { label: 'landing page regression', command: nodeCommand, args: ['artifacts/verify-landing-pages.cjs'] },
  { label: 'automation gallery regression', command: nodeCommand, args: ['artifacts/verify-automation-gallery.cjs'] },
];

let server;

async function hasExistingServer() {
  try {
    const response = await fetch('http://127.0.0.1:5173/');
    return response.ok;
  } catch {
    return false;
  }
}

function run({ command, args, label }) {
  return new Promise((resolve, reject) => {
    console.log(`\\n[test] ${label}`);
    const child = spawn(command, args, { env, stdio: 'inherit', shell: isWindows && command === npmCommand });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} failed with ${signal ?? `exit code ${code}`}`));
    });
  });
}

async function main() {
  console.log('[test] Environment: APP_ENV=test; no production database or API key is permitted.');
  await run(checks[0]);
  await run(checks[1]);
  if (await hasExistingServer()) {
    console.log('[test] Reusing the already-running test server on 127.0.0.1:5173.');
  } else {
    server = spawn(npmCommand, ['run', 'dev', '--', '--host', '127.0.0.1'], { env, stdio: 'inherit', shell: isWindows });
    for (let attempt = 0; attempt < 20 && !(await hasExistingServer()); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!(await hasExistingServer())) throw new Error('Vite test server did not become ready on 127.0.0.1:5173');
  }
  for (const check of checks.slice(2)) await run(check);
}

try {
  await main();
  console.log('\\n[test] Full suite passed.');
} catch (error) {
  console.error(`\\n[test] Full suite failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (server && !server.killed) server.kill();
}
