'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

module.exports = class extends Generator {
  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.props = {
      name: this.pkg.name
    };
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the astonishing ' + chalk.red('generator-virgo') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'name',
      message: '项目名',
      validate: str => str.trim().length > 0,
      when: !this.props.name,
      default: _.kebabCase(path.basename(process.cwd()))
    }, {
      type: 'checkbox',
      name: 'chosenFiles',
      message: '选择你要生成的文件',
      choices: [
        { name: '.editorconfig', checked: true },
        { name: '.gitignore', checked: true },
        { name: 'README.md', checked: true },
        { name: 'index.js', checked: true }
      ]
    }, {
      type: 'list',
      name: 'lintConfig',
      message: '选择你要的 eslint 配置',
      choices: [
        'Standard Style',
        'Egg + React',
        'Null'
      ]
    }];

    return this.prompt(prompts).then(props => {
      this.props = _.assignIn(this.props, props);
    });
  }

  writing() {
    const chosenFiles = this.props.chosenFiles;
    const chosenLintConfig = this.props.lintConfig;
    const templatePkg = this.pkg.name ? this.pkg : this.fs.readJSON(this.templatePath('_package.json'), {});
    const vscodeSettings = {};

    // 项目名
    _.assignIn(templatePkg, {
      name: this.props.name
    });

    // 固定的配置文件
    for (const item of chosenFiles) {
      this.fs.copyTpl(
        this.templatePath(item.replace(/^\./, '_')),
        this.destinationPath(item),
        { name: this.props.name }
      );
    }

    // eslint 配置
    if (chosenLintConfig === 'Standard Style') {
      _.assignIn(templatePkg, {
        scripts: {
          lint: 'standard'
        },
        devDependencies: {
          standard: '^10.0.0'
        }
      });
      _.assignIn(vscodeSettings, {
        'standard.enable': true
      });
    } else if (chosenLintConfig === 'Egg + React') {
      _.assignIn(templatePkg, {
        scripts: {
          lint: 'eslint .'
        },
        devDependencies: {
          eslint: '^3.18.0',
          'eslint-config-egg': '^3.2.0',
          'eslint-plugin-react': '^6.10.3'
        }
      });
      _.assignIn(vscodeSettings, {
        'eslint.enable': true
      });
      this.fs.copy(
        this.templatePath('_eslintrc'),
        this.destinationPath('.eslintrc')
      );
    }

    // 最终写文件
    this.fs.writeJSON(this.destinationPath('package.json'), templatePkg);

    if (!_.isEqual(vscodeSettings, {})) {
      this.fs.writeJSON(this.destinationPath('.vscode/settings.json'), vscodeSettings);
    }
  }

  end() {
    this.log(`\n请手动执行 ${chalk.green('npm install')} ~`);
  }
};
