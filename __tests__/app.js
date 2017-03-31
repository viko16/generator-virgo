'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');
const readTemplateFile = filename => fs.readFileSync(path.resolve(__dirname, '../generators/app/templates', filename), 'utf-8');

const defaultPrompts = {
  name: 'testing project',
  chosenFiles: ['.editorconfig', '.gitignore'],
  lintConfig: 'Standard Style'
};

describe('Default prompts', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(defaultPrompts);
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.editorconfig',
      '.gitignore'
    ]);
    assert.noFile('.eslintrc');
  });

  it('package.json', () => {
    assert.jsonFileContent('package.json', {
      name: 'testing project',
      scripts: {
        lint: 'standard'
      },
      devDependencies: {
        standard: '^9.0.0'
      }
    });
  });

  it('.editconfig', () => {
    assert.fileContent('.editorconfig', readTemplateFile('_editorconfig'));
  });

  it('.gitignore', () => {
    assert.fileContent('.gitignore', readTemplateFile('_gitignore'));
  });
});

describe('Another eslint config', () => {
  beforeAll(() => {
    const anotherPrompts = Object.assign({}, defaultPrompts, { lintConfig: 'Egg + React' });
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(anotherPrompts);
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.editorconfig',
      '.gitignore',
      '.eslintrc'
    ]);
  });

  it('package.json', () => {
    assert.jsonFileContent('package.json', {
      name: 'testing project',
      scripts: {
        lint: 'eslint .'
      },
      devDependencies: {
        eslint: '^3.18.0',
        'eslint-config-egg': '^3.2.0',
        'eslint-plugin-react': '^6.10.3'
      }
    });
  });

  it('.eslintrc', () => {
    assert.fileContent('.eslintrc', readTemplateFile('_eslintrc'));
  });
});
