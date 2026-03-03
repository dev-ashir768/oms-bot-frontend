module.exports = {
  apps: [
    {
      name: "oms-bot-frontend",
      script: "bun",
      args: "run next start -p 3000",
      exec_mode: "fork",
      instances: "1",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      merge_logs: true,
    },
  ],
};
