'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');
const readTemplateFile = filename => fs.readFileSync(path.resolve(__dirname, '../generators/app/templates', filename), 'utf-8');

const { LINT_TYPES } = require('../generators/app/constants');

const defaultPrompts = {
  name: 'testing project',
  chosenFiles: ['.editorconfig', '.gitignore', 'README.md', 'index.js'],
  lintConfig: LINT_TYPES.STANDARD
};

describe('Default prompts (standard)', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(defaultPrompts);
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.editorconfig',
      '.gitignore',
      '.vscode/settings.json',
      'README.md',
      'index.js'
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
        standard: '^10'
      }
    });
  });

  it('.editconfig', () => {
    assert.fileContent('.editorconfig', readTemplateFile('_editorconfig'));
  });

  it('.gitignore', () => {
    assert.fileContent('.gitignore', readTemplateFile('_gitignore'));
  });

  it('.vscode/settings.json', () => {
    assert.jsonFileContent('.vscode/settings.json', { 'standard.enable': true });
  });
});

describe(LINT_TYPES.ESLINT_EGG_REACT, () => {
  beforeAll(() => {
    const anotherPrompts = Object.assign({}, defaultPrompts, { lintConfig: LINT_TYPES.ESLINT_EGG_REACT });
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(anotherPrompts);
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.editorconfig',
      '.gitignore',
      '.eslintrc',
      '.vscode/settings.json',
      'README.md',
      'index.js'
    ]);
  });

  it('package.json', () => {
    assert.jsonFileContent('package.json', {
      name: 'testing project',
      scripts: {
        lint: 'eslint .'
      },
      devDependencies: {
        'babel-eslint': '^8',
        eslint: '^4',
        'eslint-config-egg': '^6',
        'eslint-plugin-react': '^7'
      }
    });
  });

  it('.eslintrc', () => {
    assert.fileContent('.eslintrc', readTemplateFile('_eslintrc_egg_react'));
  });

  it('.vscode/settings.json', () => {
    assert.jsonFileContent('.vscode/settings.json', { 'eslint.enable': true });
  });
});

describe(LINT_TYPES.ESLINT_EGG, () => {
  beforeAll(() => {
    const anotherPrompts = Object.assign({}, defaultPrompts, { lintConfig: LINT_TYPES.ESLINT_EGG });
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(anotherPrompts);
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.editorconfig',
      '.gitignore',
      '.eslintrc',
      '.vscode/settings.json',
      'README.md',
      'index.js'
    ]);
  });

  it('package.json', () => {
    assert.jsonFileContent('package.json', {
      name: 'testing project',
      scripts: {
        lint: 'eslint .'
      },
      devDependencies: {
        'babel-eslint': '^8',
        eslint: '^4',
        'eslint-config-egg': '^7'
      }
    });
  });

  it('.eslintrc', () => {
    assert.fileContent('.eslintrc', readTemplateFile('_eslintrc_egg'));
  });

  it('.vscode/settings.json', () => {
    assert.jsonFileContent('.vscode/settings.json', { 'eslint.enable': true });
  });
});
