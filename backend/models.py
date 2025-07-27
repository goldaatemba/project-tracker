from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData
from werkzeug.security import generate_password_hash, check_password_hash

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(256), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    is_blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
<<<<<<< HEAD
    cohort_id = db.Column(db.Integer, db.ForeignKey('cohorts.id'), nullable=True)
=======
    cohort_id = db.Column(db.Integer, db.ForeignKey('cohorts.id'), nullable=True)  
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef

    owned_projects = db.relationship('Project', backref='owner', lazy=True, cascade="all, delete-orphan")
    memberships = db.relationship('Member', backref='user', lazy=True, cascade="all, delete-orphan")
    cohort = db.relationship('Cohort', back_populates='members')

    def __repr__(self):
        return f"<User {self.id} - {self.username}>"

    def set_password(self, plain_password):
        self.password = generate_password_hash(plain_password)

    def check_password(self, plain_password):
        return check_password_hash(self.password, plain_password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_admin": self.is_admin,
            "is_blocked": self.is_blocked,
            "created_at": self.created_at.isoformat(),
            "cohort_id": self.cohort_id,
            "cohort": self.cohort.to_dict() if self.cohort else None
        }

class Cohort(db.Model):
    __tablename__ = 'cohorts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    projects = db.relationship('Project', backref='cohort', lazy=True, cascade="all, delete-orphan")
    members = db.relationship('User', back_populates='cohort', lazy=True)

    def __repr__(self):
        return f"<Cohort {self.id} - {self.name}>"
<<<<<<< HEAD

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "members": [
            {
                "id": member.id,
                "username": member.username,
                "email": member.email
            } for member in self.members
        ]
        }
=======
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "members": [
            {
                "id": member.id,
                "username": member.username,
                "email": member.email
            } for member in self.members
        ]
        }
    
class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tech = db.Column(db.Text, nullable=True)
    github_link = db.Column(db.Text, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cohort_id = db.Column(db.Integer, db.ForeignKey('cohorts.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    comments = db.relationship('Comment', back_populates='project', cascade="all, delete-orphan")
    members = db.relationship('Member', backref='project', lazy=True, cascade="all, delete-orphan")

class Member(db.Model):
    __tablename__ = 'members'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "user_id": self.user_id,
            "username": self.user.username,
            "email": self.user.email,
            "project_name": self.project.name
        }

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    user = db.relationship('User', backref='comments')
    project = db.relationship('Project', back_populates='comments')  # changed here

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "user": self.user.to_dict() if self.user else None,
            "user_id": self.user_id,
        }