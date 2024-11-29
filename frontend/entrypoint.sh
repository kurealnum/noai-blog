if [ "$IS_FRONTEND_PROD" = true ] ; then
    npm run serve
else
    npm run dev
fi

