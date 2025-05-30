# Generated by Django 5.0.2 on 2025-01-18 14:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blogs", "0011_rename_comment_postcomment"),
    ]

    operations = [
        migrations.AddField(
            model_name="blogpost",
            name="post_type",
            field=models.CharField(
                choices=[("BP", "Blog Post"), ("L", "Listicle")], default="BP"
            ),
        ),
        migrations.AddField(
            model_name="commentreaction",
            name="reaction_type",
            field=models.CharField(
                choices=[("BP", "Blog Post"), ("L", "Listicle")], default="BP"
            ),
        ),
        migrations.AddField(
            model_name="postcomment",
            name="comment_type",
            field=models.CharField(
                choices=[("BP", "Blog Post"), ("L", "Listicle")], default="BP"
            ),
        ),
        migrations.AddField(
            model_name="postreaction",
            name="reaction_type",
            field=models.CharField(
                choices=[("BP", "Blog Post"), ("L", "Listicle")], default="BP"
            ),
        ),
    ]
