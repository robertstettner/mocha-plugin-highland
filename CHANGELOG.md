Changelog
=========

This file does not aim to be comprehensive (you have git history for that),
rather it lists changes that might impact your own code as a consumer of
this library.

0.0.2
-----

### Bug fixes

* Fixed bug where the `this` context was not being passed through correctly
  causing functions such as `this.timeout` being undefined

0.0.1
-----

### New additions

* Added ability to return Highland streams in mocha hooks

