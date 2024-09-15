# noai-blog

Source code for the NoAI blogging site

## Testing

All tests (as of 9/15/2024) should NOT be run in production. At the moment, they are suitable for development only.

The backend is tested with `unittest`. 99% of the backend tests are unit tests, as the name suggets. Integration testing and end-to-end testing isn't really valuable for the backend, and the testing files aren't really big enough to warrant smoke testing.

The frontend is tested with React Testing Library and Vitest. React Testing Library takes care of integration testing (to be frank, it somewhat does both), and Vitest takes care of unit testing. There is currently no End-to-End testing.

The "middleware" (Nginx and Docker) is not tested.

## Technologies used/that I would like to use

Technologies that are currently in use:

- Everything in the `react-django-implementation` repository

Technologies that I would like to/need to use:

- QuillJS
- EditorJS
