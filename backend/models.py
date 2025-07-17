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
    password = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    owned_projects = db.relationship('Project', backref='owner', lazy=True)
    memberships = db.relationship('Member', backref='user', lazy=True)

    def set_password(self, plain_password):
        self.password = generate_password_hash(plain_password)

    def check_password(self, plain_password):
        return check_password_hash(self.password, plain_password)

class Cohort(db.Model):
    __tablename__ = 'cohorts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    projects = db.relationship('Project', backref='cohort', lazy=True)


class Tech(db.Model):
    __tablename__ = 'techs'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    projects = db.relationship('Project', backref='tech', lazy=True)


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github_link = db.Column(db.Text, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cohort_id = db.Column(db.Integer, db.ForeignKey('cohorts.id'), nullable=True)
    tech_id = db.Column(db.Integer, db.ForeignKey('techs.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    members = db.relationship('Member', backref='project', lazy=True)


class Member(db.Model):
    __tablename__ = 'members'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)