const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Extract runtime values from TypeScript source files
 * This script finds exported const values and enums and creates a JavaScript module
 */
function extractRuntimeValues(sourceDir, outputFile) {
  const exports = {};
  const sourceFiles = getAllTsFiles(sourceDir);

  sourceFiles.forEach(filePath => {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    extractFromNode(sourceFile, exports);
  });

  // Generate JavaScript module
  const jsContent = generateJsModule(exports);
  fs.writeFileSync(outputFile, jsContent, 'utf-8');
  console.log(`Generated ${outputFile} with runtime values`);
}

function getAllTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllTsFiles(fullPath));
    } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  });

  return files;
}

function extractFromNode(node, exports) {
  // Extract exported const declarations
  if (ts.isVariableStatement(node) && isExported(node)) {
    node.declarationList.declarations.forEach(decl => {
      if (ts.isIdentifier(decl.name) && decl.initializer) {
        const name = decl.name.text;
        const value = extractValue(decl.initializer);
        if (value !== undefined) {
          exports[name] = value;
        }
      }
    });
  }

  // Extract exported enums
  if (ts.isEnumDeclaration(node) && isExported(node)) {
    const enumName = node.name.text;
    const enumValues = {};
    
    node.members.forEach(member => {
      if (ts.isIdentifier(member.name)) {
        const key = member.name.text;
        let value = key;
        
        if (member.initializer) {
          const extracted = extractValue(member.initializer);
          if (extracted !== undefined) {
            value = extracted;
          }
        }
        
        enumValues[key] = value;
      }
    });
    
    exports[enumName] = enumValues;
  }

  // Recursively process child nodes
  ts.forEachChild(node, child => extractFromNode(child, exports));
}

function isExported(node) {
  return !!(node.modifiers && node.modifiers.some(
    mod => mod.kind === ts.SyntaxKind.ExportKeyword
  ));
}

function extractValue(node) {
  // Extract string literals
  if (ts.isStringLiteral(node)) {
    return node.text;
  }

  // Extract numeric literals
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  // Extract boolean literals
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  // Extract null/undefined
  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }
  if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return undefined;
  }

  // Extract object literals (simple ones)
  if (ts.isObjectLiteralExpression(node)) {
    const obj = {};
    node.properties.forEach(prop => {
      if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
        const key = prop.name.text;
        const value = extractValue(prop.initializer);
        if (value !== undefined) {
          obj[key] = value;
        }
      }
    });
    return Object.keys(obj).length > 0 ? obj : undefined;
  }

  // Extract array literals (simple ones)
  if (ts.isArrayLiteralExpression(node)) {
    const arr = [];
    node.elements.forEach(elem => {
      const value = extractValue(elem);
      if (value !== undefined) {
        arr.push(value);
      }
    });
    return arr.length > 0 ? arr : undefined;
  }

  return undefined;
}

function generateJsModule(exports) {
  const lines = [
    '/**',
    ' * Runtime values extracted from TypeScript source',
    ' * This file is auto-generated. Do not edit manually.',
    ' */',
    '',
    'module.exports = {'
  ];

  const keys = Object.keys(exports).sort();
  keys.forEach((key, index) => {
    const value = exports[key];
    const valueStr = JSON.stringify(value, null, 2)
      .split('\n')
      .map((line, i) => i === 0 ? line : '  ' + line)
      .join('\n');
    const comma = index < keys.length - 1 ? ',' : '';
    lines.push(`  ${key}: ${valueStr}${comma}`);
  });

  lines.push('};');
  lines.push('');

  return lines.join('\n');
}

// Main execution
const sourceDir = path.join(__dirname, '../src');
const outputFile = path.join(__dirname, '../index.js');

extractRuntimeValues(sourceDir, outputFile);
