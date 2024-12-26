# noai-blog

Source code for the NoAI blogging site

## Running the project

`docker compose up -w` or `docker compose up -w --build`

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
- TanStack Query
- EasyMDE

Technologies that I would like to/need to use:

- None at the moment

## Important Notes

When running the project in production, the admin panel is **not** located at /admin/. It is instead located at /a-beautiful-fruit-tree-swaying-in-the-wind-fb520ad7a6e0e3f11a860efbcef3e66c/.

`#language-field` (CSS) is a honeypot field for the register page.

For the love of all that is holy, please, please, PLEASE, use `DOMPurify.sanitize()` on any blog post/markdown content that you render.

When referencing the different kinds of articles on byeAI (listicles, tutorials, general articles, etc.), "post" articles refer to, well, standard articles, "lists" refer to listicles, and "tutorials" refers to tutorials.

### Testing Markdown

Use this bit of markdown to test any Markdown renders:

```
**This is bold text**

*This is italic text*

# This is a level 1 heading

## This is a level 2 heading

> This is a quote
>
> This is a multiline quote

* This is a generic list
* And another list item

1. This is a numbered list
2. And another numbered list item

[This is a link to Google](https://www.google.com/)

![This is a link to an image!](https://i.imgur.com/zi2TYNJ.jpeg)
```

## Env file setup

```
DATABASE_NAME="noai-migration-issue"
DATABASE_USER="postgres"
DATABASE_PASSWORD="afoi32)A013'a32]AOMNCVXO"
DATABASE_PORT=5432
DATABASE_HOST="postgres"

DJANGO_SECRET_KEY="my-secret-key"
DEBUG=True
ALLOWED_HOSTS='["*"]'

CORS_ALLOWED_ORIGINS='["http://localhost:1337","http://127.0.0.1:1337"]'
CSRF_TRUSTED_ORIGINS='["http://localhost:1337","http://127.0.0.1:1337"]'

CSRF_COOKIE_SAMESITE="Strict"
SESSION_COOKIE_SAMESITE="Strict"
CSRF_COOKIE_HTTPONLY=False
SESSION_COOKIE_HTTPONLY=True
CSRF_COOKIE_SECURE=False
SESSION_COOKIE_SECURE=False
CORS_EXPOSE_HEADERS='["Content-Type","X-CSRFToken]'
CORS_ALLOW_CREDENTIALS=True

EMAIL_HOST="localhost"
EMAIL_PORT=587
EMAIL_HOST_PASSWORD="ohnh obes bksi pvog"
EMAIL_HOST_USER="thenoaiblog@gmail.com"
EMAIL_USE_TLS=False

IS_FRONTEND_PROD=true
IS_BACKEND_PROD=true
NGINX_TARGET="prod"

USE_STORAGES=True
AWS_ACCESS_KEY_ID="accesskey"
AWS_SECRET_ACCESS_KEY="secretaccesskey"
AWS_STORAGE_BUCKET_NAME="byeai-main-spaces"
AWS_S3_ENDPOINT_URL="https://myurl"
AWS_LOCATION='static'
AWS_DEFAULT_ACL='public-read'
AWS_QUERYSTRING_AUTH=False

STATICFILES_STORAGE="backend.storage_backends.StaticStorage"
STATIC_ROOT="collectedstatic/"
STATIC_URL="static/"
MEDIA_URL="media/"
```

The email stuff is not currently in use.

NGINX_TARGET should either be "dev" or "prod". This determines which NGINX vhost configurations are copied.

Yes, you do need to rebuild your docker container if you change any of the environment variables.
