# Contributing Guide

## Install Deps

```sh
npm install
```

## Plugin Development

These steps will help you work on the plugin itself. Each of these processes should ran in a separate terminal.

### Start TS Build

```sh
npm run start
```

### Start Local Website

```sh
cd website
npm run start
```

### Making CSS Changes

If you make CSS changes locally while running in watch mode, you will need to run:

```sh
npm run build:css
```

This will copy over the css module files into their correct location for docusaurus to pick up and re-build.

## Testing

```sh
npm run test
```
