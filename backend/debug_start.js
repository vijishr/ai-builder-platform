process.on('beforeExit', (code) => {
  console.log('Process beforeExit, code:', code);
});
process.on('exit', (code) => {
  console.log('Process exit, code:', code);
});
process.on('SIGINT', () => {
  console.log('Received SIGINT');
  process.exit(0);
});
process.on('uncaughtException', (err) => {
  console.error('Wrapper uncaughtException:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Wrapper unhandledRejection:', reason);
});

(async () => {
  try {
    await import('./src/server.js');
    console.log('Server imported successfully');
  } catch (e) {
    console.error('Import failed:', e && e.stack ? e.stack : e);
  }
})();

// Keep the event loop alive
setInterval(() => {}, 1000);
