# noai-blog

Source code for the NoAI blogging site

## Testing

All tests (as of 9/15/2024) should NOT be run in production. At the moment, they are suitable for development only.

Aim for 80% coverage or higher. If you have nothing else to do, write more tests!

All tests should do their best to resemble the file structure found in `/src`. For instance, if you're testing `src/feature/file.js`, your test should be located at `tests/feature/file.test.js`.

### Tooling

The backend is tested with `unittest`. 99% of the backend tests are unit tests, as the name suggets. Integration testing and end-to-end testing isn't really valuable for the backend, and the testing files aren't really big enough to warrant smoke testing.

The frontend is tested with React Testing Library and Vitest. React Testing Library takes care of integration testing (to be frank, it somewhat does both), and Vitest takes care of unit testing. There is currently no End-to-End testing. Vitest claims that coverage is done with `istanbul`, but it's actually being done with `v8`. No idea why it says otherwise.

The "middleware" (Nginx and Docker) is not tested.

## Technologies used/that I would like to use

Technologies that are currently in use:

- Everything in the `react-django-implementation` repository

Technologies that I would like to/need to use:

- QuillJS
- EditorJS
