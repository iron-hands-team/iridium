FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd celery
USER celery

CMD ["celery","-A","app","worker","-B","-l","info","-s","/tmp/celerybeat-schedule"]