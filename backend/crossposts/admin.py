from django.contrib import admin

from crossposts.models import Crosspost, CrosspostComment, CrosspostReaction

# Register your models here.
admin.site.register(Crosspost)
admin.site.register(CrosspostReaction)
admin.site.register(CrosspostComment)
