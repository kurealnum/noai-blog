from django.contrib import admin

from blogs.models import (
    BlogPost,
    PostComment,
    CommentReaction,
    PostReaction,
    Crosspost,
)

admin.site.register(BlogPost)
admin.site.register(PostReaction)
admin.site.register(PostComment)
admin.site.register(CommentReaction)
admin.site.register(Crosspost)
