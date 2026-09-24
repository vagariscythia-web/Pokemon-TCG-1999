const fs = require('fs');
const ts = require('typescript');
const code = fs.readFileSync('src/components/BattleFXOverlay.tsx', 'utf8');
const sf = ts.createSourceFile('test.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const diags = sf.parseDiagnostics;
console.log('Parse diagnostics count:', diags.length);
for (const d of diags.slice(0, 10)) {
  const { line, character } = sf.getLineAndCharacterOfPosition(d.start);
  console.log('Line ' + (line + 1) + ':' + (character + 1) + ' - ' + d.messageText);
}
