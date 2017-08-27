'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const extend = require('deep-extend');
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
        { name: '.gitignore', checked: true }
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
      this.props = extend(this.props, props);
    });
  }

  writing() {
    const chosenFiles = this.props.chosenFiles;
    const chosenLintConfig = this.props.lintConfig;
    const templatePkg = this.pkg.name ? this.pkg : this.fs.readJSON(this.templatePath('_package.json'), {});

    // 项目名
    extend(templatePkg, {
      name: this.props.name
    });

    // 固定的配置文件
    for (const item of chosenFiles) {
      this.fs.copy(
        this.templatePath(item.replace(/^\./, '_')),
        this.destinationPath(item)
      );
    }

    // eslint 配置
    if (chosenLintConfig === 'Standard Style') {
      extend(templatePkg, {
        scripts: {
          lint: 'standard'
        },
        devDependencies: {
          standard: '^10.0.0'
        }
      });
    } else if (chosenLintConfig === 'Egg + React') {
      extend(templatePkg, {
        scripts: {
          lint: 'eslint .'
        },
        devDependencies: {
          eslint: '^3.18.0',
          'eslint-config-egg': '^3.2.0',
          'eslint-plugin-react': '^6.10.3'
        }
      });
      this.fs.copy(
        this.templatePath('_eslintrc'),
        this.destinationPath('.eslintrc')
      );
    }

    // 最终写文件
    this.fs.writeJSON(this.destinationPath('package.json'), templatePkg);
  }

  end() {
    this.log(`\n请手动执行 ${chalk.green('npm install')} ~`);
  }
};
