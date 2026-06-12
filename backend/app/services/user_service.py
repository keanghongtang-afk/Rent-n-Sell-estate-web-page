from fastapi import HTTPException
from app.FilePath import UsersPath
from app.schemas import UserSignup
from app.db import session, User

class UserService:
    @staticmethod
    def signup(user: UserSignup):
        try:
            same = session.query(User).filter(
                User.name == user.name,
                User.email == user.email
            ).first()
            if same:
                raise HTTPException(status_code=409,detail="username or email is already exist")
            signup = User(
                name=user.name,
                email=user.email,
                password=user.password
            )
            session.add(signup)
            session.commit()
            return {"message":"Signup successfully"}
        except Exception as e:
            return {"error":str(e)}
        finally: session.close()

    @staticmethod
    def login(user_email: str, user_password: str):
        try:
            user = session.query(User).filter(User.email == user_email).first()
            if user:
                if user.password == user_password:
                    return True
                else:
                    raise HTTPException(status_code=401,detail="Wrong password")
            else:
                raise HTTPException(status_code=401,detail="Wrong email")
        except Exception as e:
            return {"error":str(e.detail)}
        finally: session.close()

    @staticmethod
    def get_user_info(user_email: str):
        try:
            user = session.query(User).filter(User.email == user_email).first()
            if user:
                return {"Name": user.name, "Email": user.email}
            else:
                raise HTTPException(status_code=404, detail="User not found")
        except Exception as e:
            return {"error": str(e)}