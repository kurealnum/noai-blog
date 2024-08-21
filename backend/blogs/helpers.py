from django.db import connection


def get_comment_replies(comment_id):
    query = f"""
        WITH RECURSIVE comments AS (
                SELECT reply_id 
                FROM blogs_replyto
                WHERE id = %s
            UNION ALL
                SELECT comment_id
                FROM blogs_replyto AS br
        )
        SELECT * 
        FROM comments AS c
        JOIN blogs_comment bc ON bc.id = c.reply_id;
        """

    with connection.cursor() as cursor:
        cursor.execute(query, [comment_id])
        res = cursor.fetchall()
        return res
