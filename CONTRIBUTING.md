# Guide for contributors

* **Would you like to ask a question, discuss feature ideas or noticed a (potential) bug?** Please open an issue here on github.
* **Would you like to contribute code?** Your help is very welcome! This doc covers how to become a contributor and submit code to the project.

## Submitting pull requests

First of all, thanks very much for spending the time to improve the code! 🎉

Please don't submit a pull request until the code is completely ready.

If you're planning to change lots of code, it would be preferable if you submitted several smaller pull requests for independent changes, instead of one big batch with everything in it. Smaller changes are easier to validate and discuss, and it's easier to catch unintended changes with those. 

Please make sure your pull request includes only the changes necessary for your code. Don't submit the lines that have only formatting changes, unless this is required by the linter. Don't submit files that are not important for your particular change.

### Before submitting the request

In order to make it easier for us to develop together and maintain the code easier, here's what would be ideal:

* Make sure the code is passing the style guide checks.
* Please supply automated tests for any new functionality you are adding. With these in place, people who modify the same code in the future can easily ensure that they've not broken something that is important to you. 
* If you are adding or removing command line options, please change the documentation.
* Please run all tests to ensure everything still works as expected.
