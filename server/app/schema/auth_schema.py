from pydantic import BaseModel, Field, EmailStr, field_validator
import re

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class RegisterUser(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)

    @field_validator('username')
    @classmethod
    def username_must_be_at_least_three_words(cls, v):
        if len(v) < 3:
            raise ValueError('Kullanıcı adı en az üç kelime olmalıdır')
        return v

    @field_validator('email')
    @classmethod
    def email_must_be_valid(cls, v):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Geçersiz e-posta formatı')
        return v

    @field_validator('password')
    @classmethod
    def password_must_be_strong(cls, v):
        if len(v) < 6:
            raise ValueError('Şifre en az 6 karakter olmalıdır')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Şifre en az bir büyük harf içermelidir')
        if not re.search(r'[a-z]', v):
            raise ValueError('Şifre en az bir küçük harf içermelidir')
        if not re.search(r'\d', v):
            raise ValueError('Şifre en az bir rakam içermelidir')
        return v