# **I18N Dictionary Generator**

I18N Dictionary Generator is a tool designed to simplify and accelerate the process of adding and managing translations in your projects. Whether you're starting a project from scratch or integrating translations into an ongoing development, this tool helps eliminate the hassle and streamline your workflow.

## Why I Created This Tool

Adding translations partway through development can be a tedious and error-prone task. I built I18N Dictionary Generator after experiencing firsthand the challenges of retrofitting translation functionality into a project that was already underway. This tool was born out of the need for a faster, more efficient way to handle internationalization (i18n).

## Features

### Benefits

- **Saves Time**: Automates repetitive tasks and reduces manual effort.
- **Improves Accuracy**: Minimizes the risk of human errors when creating and managing translation dictionaries.
- **Scales Easily**: Works seamlessly with projects of any size, from small apps to large-scale platforms.
- **Compatible with Your Workflow**: Designed to integrate into your existing development environment and tools.

### Supported Capabilities

- Automatic project scanning for translatable text
- Multi-language translation generation
- Easy translation file management
- Configurable translation sources
- Integration with google transalte and LibreTranslate for automated translations

## Prerequisites

- Node.js (version 14.0.0 or higher)
- npm (version 6.0.0 or higher)

## Installation

You can install the tool via npm:

```shell
npm install i18n-dictionary-generator
```

Or clone the repository and run it locally:

```shell
git clone https://github.com/yourusername/i18n-dictionary-generator.git
cd i18n-dictionary-generator
npm install
npm start
```

## Configuration

Create a `.env` file in your project root with the following optional configuration:

```
TRANSLATION_DIR_NAME="i18n"
LIBRETRANSLATE_URL="http://localhost:5000/translate"
```

### Default Values

- `TRANSLATION_DIR_NAME`: "i18n"
- `LIBRETRANSLATE_URL`: "http://localhost:5000/translate"

## Usage/Examples

### Initialize the Generator

Scan your project for translatable text:

```shell
i18ndg init
```

### Generate Translation Files

Create translation dictionaries:

```shell
i18ndg generate <source> [langs...]
```

### Add or Update Translations

Add new translations or update existing ones directly in the generated files.

## Available Commands

- `init`: Scan project and generate default translation dictionary (en.json)
- `generate <source> [langs...]`: Generate translations using an English dictionary
- `show`: Display migrations
- `help [command]`: Display help for a specific command

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License.

See the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
