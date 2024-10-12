from django.contrib import admin

from blogs.models import BlogPost, Comment, CommentReaction, PostReaction

admin.site.register(BlogPost)
admin.site.register(PostReaction)
admin.site.register(Comment)
admin.site.register(CommentReaction)
