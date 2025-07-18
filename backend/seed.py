from models import User, db
from app import create_app

app = create_app()

def seed():
    with app.app_context():
        username = "admin"
        email = "admin@gmail.com"
        password = "admin"

        username_exists = User.query.filter_by(username=username).first()
        if username_exists:
            print("Username already exists.")
            return
        
        email_exists = User.query.filter_by(email=email).first()
        if email_exists:
            print("Email already exists.")
            return

        new_admin = User(username=username, email=email, is_admin=True)
        new_admin.set_password(password)

        db.session.add(new_admin)
        db.session.commit()
        print("Admin added successfully.")

seed()
