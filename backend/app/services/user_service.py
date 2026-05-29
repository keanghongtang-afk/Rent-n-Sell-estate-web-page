import json
from fastapi import HTTPException
from app.FilePath import UsersPath
from app.schemas import UserSignup

class UserService:
    @staticmethod
    def signup(user: UserSignup):
        try:
            with open(UsersPath, "r") as f:
                Users = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            Users = []
        Users.append({
            "Name": user.name,
            "Email": user.email,
            "Password": user.password
        })
        with open(UsersPath, 'w') as f:
            json.dump(Users, f, indent=2)
        
        return {
            "Name": user.name,
            "Email": user.email,
            "Password": user.password
        }

    @staticmethod
    def get_user(user_email: str):
        try:
            with open(UsersPath, "r") as f:
                Users = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            Users = []
        for user in Users:
            if user["Email"] == user_email:
                return {"Name": user["Name"], "Email": user["Email"]}
        raise HTTPException(status_code=404, detail="User not found")

    @staticmethod
    def login(user_email: str, user_password: str):
        try:
            with open(UsersPath, "r") as f:
                Users = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            Users = []
        for user in Users:
            if user["Email"] == user_email:
                if user["Password"] == user_password:
                    return True
                return "Wrong Password or Email! Please try again!"
        return "User not found!"
