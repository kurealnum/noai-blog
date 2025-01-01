from django.contrib import admin

from blogs.models import BlogPost, PostComment, CommentReaction, Follower, PostReaction

admin.site.register(BlogPost)
admin.site.register(PostReaction)
admin.site.register(PostComment)
admin.site.register(CommentReaction)
admin.site.register(Follower)
