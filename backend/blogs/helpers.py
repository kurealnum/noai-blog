from django.db import connection


def get_comment_replies(comment_id):
    # FIXME: still need to fix this query to join everything
    query = f"""
        WITH RECURSIVE comments AS (
                SELECT reply_id 
                FROM blogs_replyto
                WHERE id = %s
            UNION ALL
                SELECT comment_id
                FROM blogs_replyto AS br
                JOIN blogs_comment bc ON bc.id=br.comment_id
        )
        SELECT * FROM comments;
        """

    with connection.cursor() as cursor:
        cursor.execute(query, [comment_id])
        res = cursor.fetchall()
        return res
