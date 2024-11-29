if [ "$IS_FRONTEND_PROD" = true ] ; then
    npm run build
    npm run serve
else
    npm run dev
fi

