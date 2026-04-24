module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./backend",
      script: "pnpm",
      args: "run start",         // or "start" for production
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 5000
      }
    },
    {
      name: "frontend",
      cwd: "./frontend",
      script: "pnpm",
      args: "start",        // ← change from "dev" to "start"
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
