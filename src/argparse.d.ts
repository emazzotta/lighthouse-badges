declare module 'argparse' {
  export interface ArgumentParserOptions {
    description?: string;
    add_help?: boolean;
  }

  export class ArgumentGroup {
    add_argument(name: string, longName: string, options?: ArgumentOptions): void;
  }

  export interface ArgumentOptions {
    action?: string;
    version?: string;
    help?: string;
    required?: boolean;
    choices?: string[];
    default?: string;
  }

  export class ArgumentParser {
    constructor(options?: ArgumentParserOptions);
    add_argument(name: string, longName: string, options?: ArgumentOptions): void;
    add_argument_group(options: { title: string }): ArgumentGroup;
    parse_args(args?: string[]): Record<string, unknown>;
  }
}

