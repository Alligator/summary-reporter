import path from 'path';
import { AggregatedResult, Config, Context, Reporter } from '@jest/reporters';

class SummaryReporter implements Pick<Reporter, 'onRunComplete'> {
  private _globalConfig: Config.GlobalConfig;

  constructor(globalConfig: Config.GlobalConfig) {
    this._globalConfig = globalConfig;
  }

  onRunComplete(_contexts: Set<Context>, results: AggregatedResult) {
    const failures: Record<string, string[]> = {};

    results.testResults.map((result) => {
      const filePath = path.relative(this._globalConfig.rootDir, result.testFilePath);
      result.testResults.map((assertionResult) => {
        if (assertionResult.status === 'failed') {
          failures[filePath] = failures[filePath] || [];
          failures[filePath].push(assertionResult.fullName);
        }
      });
    });

    if (Object.keys(failures).length) {
      console.log('\nFailed test summary:\n');
      Object.entries(failures).forEach(([file, testFailures]) => {
        console.log(file);
        testFailures.forEach((testFailure) => {
          console.log(`\x1b[91m${testFailure}\x1b[0m`);
        });
        console.log('');
      });
    }
  }
}

export default SummaryReporter;