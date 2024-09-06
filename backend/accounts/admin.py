from django.contrib import admin

from accounts.models import CustomUser, Link

# admin.site.unregister(CustomUser)
# admin.site.unregister(Link)

admin.site.register(CustomUser)
admin.site.register(Link)
