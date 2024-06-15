#!/usr/bin/env node

import handleUserInput from "./main.js";
import CLI from "clui";

const CLI_SPINNER = new CLI.Spinner('Running Lighthouse, please wait...', ['◜', '◠', '◝', '◞', '◡', '◟']);
handleUserInput(CLI_SPINNER).then(() => {});
