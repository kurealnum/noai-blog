from django.db.models import Q
from blogs.models import BlogPost, post_type_reducer


"""
This is a function for returning a QuerySet with all BlogPosts and Crossposts of type post_type
"""


def filter_blog_post_by_post_type(post_type, *args, **kwargs):
    # This would normally be called at the model leve, but since we're using complex queries (Q), we just do it at view/query level.
    post_type = post_type_reducer(post_type)
    return BlogPost.objects.filter(
        Q(post_type=post_type) | Q(post_type="crosspost"),
        Q(crosspost__crosspost_type=None) | Q(crosspost__crosspost_type=post_type),
        *args,
        **kwargs
    ).select_related("crosspost")
