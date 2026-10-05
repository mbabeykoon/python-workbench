<<<<<<< HEAD
# Python Workbench

Python Workbench is a lightweight VS Code extension for running and testing Python code interactively.

The first version focuses on a simple workflow:

1. Select Python code in a `.py` file.
2. Run the selection directly from VS Code.
3. View the result without manually constructing terminal commands.

The longer-term goal is to develop Python Workbench into an interactive Python environment inside VS Code, similar in spirit to an IPython console, while remaining closely integrated with normal Python source files and project environments.

## Current Status

Python Workbench is currently under active development.

The first working prototype supports running selected Python code through a `uv` environment.

The next version will introduce a more general execution system so that `uv` is only one supported backend.

Planned execution backends include:

- Standard Python interpreters
- Virtual environments
- uv
- Conda
- Other Python environment managers where practical

## Vision

Python Workbench is intended to support two complementary workflows.

### Run code from existing Python files

Select a block of Python code and execute it immediately without running the entire script.

Example:

```python
def add(a, b):
    return a + b

print(add(3, 4))
=======
# uv-python-runner README

This is the README for your extension "uv-python-runner". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
>>>>>>> c1eebc6 (Initialize Python Workbench extension)
