module.exports = {
    default: {
      require: ["src/cucumber-test/cucumber-steps/**/*.ts"],  // Path to step definitions
      requireModule: ["ts-node/register"],  // Enable TypeScript execution
      paths: ["src/cucumber-test/cucumber-features/**/*.feature"],  // Path to feature files
      format: ["progress-bar", "json:reports/cucumber-report.json"],  // Output format
    },
  };
  