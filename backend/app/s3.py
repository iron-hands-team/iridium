import os
import boto3
from botocore.client import Config

ENDPOINT = os.getenv("FRONTEND_URL", "https://localhost")
ACCESS_KEY = os.getenv("GARAGE_ACCESS_KEY")
SECRET_KEY = os.getenv("GARAGE_SECRET_KEY")
BUCKET_NAME = "iridium-uploads"

s3_client = boto3.client(
    "s3",
    endpoint_url=ENDPOINT,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="garage",
    config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
)
