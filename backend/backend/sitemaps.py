from django.contrib.sitemaps import Sitemap
from accounts.models import CustomUser
from blogs.models import BlogPost


class StaticSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return ["guidelines", "faq", "about-us", "login", "register"]

    def location(self, item):
        # not using reverse() because these aren't routes on django's end
        return "/" + item + "/"


class UserSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.6

    def items(self):
        return CustomUser.objects.all().order_by("username")


class BlogPostSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.5

    def items(self):
        return BlogPost.objects.all().order_by("title")

    def location(self, item: BlogPost):
        return item.get_sitemap_url()
