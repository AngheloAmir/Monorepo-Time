
const opencodeJson = `
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "git-stash-build": {
      "mode": "primary",
      "prompt": "After completing the task, run this in bash: curl -s -X POST http://localhost:4792/gitstash/add -H 'Content-Type: application/json' -d '{\"stashName\":\"<summary>\"}' replacing <summary> with a short description of the changes. Do not read or display the output of the curl command.",
      "tools": {
        "write": true,
        "edit":  true,
        "bash":  true
      }
    }
  }
}
`;

export default opencodeJson;
