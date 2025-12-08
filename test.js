console.log("Node.js is working!");
console.log("Process env:", process.env.NODE_ENV || "not set");
setTimeout(() => {
  console.log("Timeout test passed - process still running");
}, 1000);
