import hashlib
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from jose import jwt, JWTError
from app.core.config import settings

def get_password_hash(password: str) -> str:
    # Use SHA-256 pre-hash to ensure password is strictly under 72 bytes for bcrypt
    pwd_bytes = password.encode('utf-8')
    sha_hash = hashlib.sha256(pwd_bytes).digest()
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(sha_hash, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode('utf-8')
        sha_hash = hashlib.sha256(pwd_bytes).digest()
        return bcrypt.checkpw(sha_hash, hashed_password.encode('utf-8'))
    except Exception:
        return plain_password == hashed_password

def create_access_token(subject: Any, role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

