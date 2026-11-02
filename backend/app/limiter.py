from fastapi import Request
from slowapi import Limiter

def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    return forwarded.split(",")[0].strip() if forwarded else request.client.host

limiter = Limiter(key_func=client_ip)