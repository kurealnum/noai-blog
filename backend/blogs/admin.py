from django.contrib import admin

from blogs.models import BlogPost, Comment, CommentReaction, Follower, PostReaction

admin.site.register(BlogPost)
admin.site.register(PostReaction)
admin.site.register(Comment)
admin.site.register(CommentReaction)
admin.site.register(Follower)
