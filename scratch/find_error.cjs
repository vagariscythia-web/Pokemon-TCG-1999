const fs = require('fs');
const ts = require('typescript');
const code = fs.readFileSync('src/components/BattleFXOverlay.tsx', 'utf8');
const lines = code.split('\n');

// Test parsing chunks
// Find the exact line where an unclosed JSX tag or unclosed brace starts
// In TSX, if an unclosed tag occurs, the whole outer element remains open.
// Let's test each fx.type block by wrapping it in dummy JSX:
// const test = ( <div> { BLOCK } </div> );

const blocks = [];
let currentStart = -1;
let currentName = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/\{(?:\(?fx\.type === ['"]([^'"]+)['"]|\(fx\.type === ['"]([^'"]+)['"])/);
  if (m) {
    if (currentStart !== -1) {
      blocks.push({ name: currentName, start: currentStart, end: i - 1 });
    }
    currentStart = i;
    currentName = m[1] || m[2];
  }
}
if (currentStart !== -1) {
  blocks.push({ name: currentName, start: currentStart, end: lines.length - 1 });
}

console.log(`Found ${blocks.length} fx blocks.`);

for (const b of blocks) {
  const blockCode = lines.slice(b.start, b.end + 1).join('\n');
  const dummy = `const Dummy = () => (\n  <div>\n${blockCode}\n  </div>\n);`;
  const sf = ts.createSourceFile('test.tsx', dummy, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  if (sf.parseDiagnostics.length > 0) {
    console.log(`Block ${b.name} (lines ${b.start + 1}-${b.end + 1}) has ${sf.parseDiagnostics.length} parse errors:`);
    for (const d of sf.parseDiagnostics.slice(0, 2)) {
      const { line } = sf.getLineAndCharacterOfPosition(d.start);
      console.log(`  Line in file: ${b.start + line - 2}: ${d.messageText}`);
    }
  }
}
