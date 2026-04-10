#!/usr/bin/env node

import handleUserInput from './main.js';
import CLI from 'clui';

const spinner = new CLI.Spinner('Running Lighthouse, please wait...', ['◜', '◠', '◝', '◞', '◡', '◟']);
await handleUserInput(spinner);
