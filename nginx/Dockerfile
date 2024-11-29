FROM nginx:latest AS base

# move config
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx

# enable sites
FROM base AS dev
COPY sites-available/django-react-dev /etc/nginx/sites-available/
RUN mv /etc/nginx/sites-available /etc/nginx/sites-enabled/

FROM base AS prod
COPY sites-available/django-react-prod /etc/nginx/sites-available/
RUN mv /etc/nginx/sites-available /etc/nginx/sites-enabled/





