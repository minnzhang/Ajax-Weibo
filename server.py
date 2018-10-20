from flask import Flask
from routes.routes_public import bp as public_route
from routes.routes_user import bp as user_route
from routes.routes_weibo import bp as weibo_route
from routes.api_weibo import bp as api_weibo

app = Flask(__name__)
app.register_blueprint(public_route)
app.register_blueprint(user_route)
app.register_blueprint(weibo_route)
app.register_blueprint(api_weibo)

if __name__ == '__main__':
    config = dict(
        debug=True,
        host='localhost',
        port=3000,
    )

    app.run(**config)
