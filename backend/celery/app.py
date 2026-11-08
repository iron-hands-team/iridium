import os

from celery import Celery
from celery.schedules import crontab

app = Celery("iridium", broker=os.environ["CELERY_BROKER_URL"], include=["tasks"])

app.conf.timezone = "UTC"
app.conf.beat_schedule = {
    "archive_posts": {
        "task": "tasks.archive_posts",
        "schedule": 600,
    },
    "delete_posts": {
        "task": "tasks.delete_posts",
        "schedule": 600,
    },
    "delete_messages": {
        "task": "tasks.delete_messages",
        "schedule": 600,
    },
}
