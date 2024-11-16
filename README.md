# **I18N Dictionary Generator**

I18N Dictionary Generator is a tool designed to simplify and accelerate the process of adding and managing translations in your projects. Whether you're starting a project from scratch or integrating translations into an ongoing development, this tool helps eliminate the hassle and streamline your workflow.

## Why I Created This Tool

Adding translations partway through development can be a tedious and error-prone task. I built I18N Dictionary Generator after experiencing firsthand the challenges of retrofitting translation functionality into a project that was already underway. This tool was born out of the need for a faster, more efficient way to handle internationalization (i18n).
Features

    Automatic Key Generation: Extracts text from your project and generates structured translation keys.
    Multi-Language Support: Easily manage translations for multiple languages in a single, organized workflow.
    Customizable Output: Generate translation files in JSON, YAML, or other formats your project uses.
    Conflict Detection: Identifies duplicate or missing keys to ensure translation consistency.
    Incremental Updates: Quickly integrate new translations without redoing existing work.

Benefits

    Saves Time: Automates repetitive tasks and reduces manual effort.
    Improves Accuracy: Minimizes the risk of human errors when creating and managing translation dictionaries.
    Scales Easily: Works seamlessly with projects of any size, from small apps to large-scale platforms.
    Compatible with Your Workflow: Designed to integrate into your existing development environment and tools.

## Getting Started

### Installation

You can install the tool via npm:

```shell
npm install -g i18n-dictionary-generator
```

Or clone the repository and run it locally:

```shell
git clone https://github.com/yourusername/i18n-dictionary-generator.git
cd i18n-dictionary-generator
npm install
npm start
```

### Usage:

    1. Initialize the Generator: Run the following command to scan your project for translatable text:

```shell
i18n-dict-gen init
```

    2. Generate Translation Files: After initialization, generate translation dictionaries with:

```bash
    i18n-dict-gen generate
```

    Add or Update Translations: Add new translations or update existing ones directly in the generated files.

### Configuration:

The tool uses a i18n-config.json file for custom settings, such as:

    Source directories
    File extensions to scan
    Output file structure and format

### Contributing:

Contributions are welcome! Feel free to fork the repository and submit a pull request with your improvements. Please make sure your changes pass all tests and adhere to the project's coding guidelines.
License

This project is licensed under the MIT License. See the LICENSE file for details.
Feedback

Have questions, suggestions, or feedback? Reach out or create an issue on the GitHub repository. Your input is invaluable in making this tool better for everyone!

With I18N Dictionary Generator, adding translations to your project is no longer a pain—it's a breeze.
