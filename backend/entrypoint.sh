python3 manage.py migrate
# creates a superuser
python3 manage.py initadmin
python3 manage.py collectstatic --noinput

if [ "$IS_BACKEND_PROD" = true ] ; then
    gunicorn --bind 0.0.0.0:6900 backend.wsgi 
else
    python3 manage.py runserver 0.0.0.0:6900
fi
