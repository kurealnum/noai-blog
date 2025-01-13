from django.contrib import admin

from lists.models import List, ListComment, ListCommentReaction, ListReaction

admin.site.register(List)
admin.site.register(ListReaction)
admin.site.register(ListComment)
admin.site.register(ListCommentReaction)
