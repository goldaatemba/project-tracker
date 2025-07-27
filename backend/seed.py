from models import User, db, Cohort
from app import app
from werkzeug.security import generate_password_hash

def seed():
    with app.app_context():

        admin_username = "admin"
        admin_email = "admin@gmail.com"
        admin_password = "admin"

        if User.query.filter_by(username=admin_username).first():
            print(" Username 'admin' already exists.")
        elif User.query.filter_by(email=admin_email).first():
            print(" Email 'admin@gmail.com' already exists.")
        else:
            new_admin = User(
                username=admin_username,
                email=admin_email,
                password=generate_password_hash(admin_password),
                is_admin=True
            )
            db.session.add(new_admin)
            db.session.commit()
            print(" Admin user created.")

        c1 = Cohort(name="Cohort Alpha")
        c2 = Cohort(name="Cohort Beta")
        c3 = Cohort(name="Cohort Gamma")
        db.session.add_all([c1, c2, c3])
        db.session.commit()
        print(" Cohorts created.")

        users = [
            User(
                username="alice",
                email="alice@example.com",
                password=generate_password_hash("password123"),
                cohort=c1
            ),
            User(
                username="bob",
                email="bob@example.com",
                password=generate_password_hash("password123"),
                cohort=c1
            ),
            User(
                username="carol",
                email="carol@example.com",
                password=generate_password_hash("password123"),
                cohort=c2
            ),
            User(
                username="dave",
                email="dave@example.com",
                password=generate_password_hash("password123"),
                cohort=None
            )
        ]
        db.session.add_all(users)
        db.session.commit()
        print(" Sample users created.")

if __name__ == "__main__":
    seed()
