const repl = require('repl');
const { exec } = require('child_process');

// Create a custom REPL server with a "run" command
const r = repl.start({
  prompt: '>>> ',
  eval: (cmd, context, filename, callback) => {
    if (cmd.trim() === 'exit') {
      r.close();
    } else if (cmd.trim().startsWith('run ')) {
      const command = cmd.trim().substring(4);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          callback(error);
        } else if (stderr) {
          callback(stderr);
        } else {
          callback(null, stdout);
        }
      });
    } else {
      callback(null, undefined);
    }
  }
});
