#!/usr/bin/env node

import handleUserInput from './main.js';
import { createSpinner } from './spinner.js';

await handleUserInput(createSpinner('Running Lighthouse, please wait...'));
