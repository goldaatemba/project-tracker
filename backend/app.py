from flask import Flask
from flask_migrate import Migrate
from models import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project.db'
app.config['sqlalCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app,db)


if __name__ == '__main__':
    app.run(debug=True)