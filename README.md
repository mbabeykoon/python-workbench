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
