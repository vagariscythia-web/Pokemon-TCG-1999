const fs = require('fs');
const code = fs.readFileSync('src/components/BattleFXOverlay.tsx', 'utf8');
const lines = code.split('\n');

const stack = [];

// Simple regex to find JSX tags:
// opening tag: <([a-zA-Z0-9_]+)(\s|>)
// closing tag: </([a-zA-Z0-9_]+)>
// self-closing: <.../>
// Let's use TS parser to walk AST nodes!
const ts = require('typescript');
const sf = ts.createSourceFile('test.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

function walk(node, depth = 0) {
  if (ts.isJsxElement(node)) {
    const openTag = node.openingElement.tagName.getText(sf);
    const closeTag = node.closingElement.tagName.getText(sf);
    // check matching
  }
  ts.forEachChild(node, child => walk(child, depth + 1));
}

// Let's check git diff of what was changed from HEAD
const { execSync } = require('child_process');
const diff = execSync('git diff --name-only', { encoding: 'utf8' });
console.log('Modified files:', diff.trim());

// Let's find unclosed JSX tags by line range
