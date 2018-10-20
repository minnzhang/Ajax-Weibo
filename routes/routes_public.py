from routes import current_user
from flask import (
    render_template,
    Blueprint,
)

bp = Blueprint('public', __name__)


@bp.route('/')
def index():
    """
    主页的处理函数, 返回主页的响应
    """
    u = current_user()
    return render_template('index.html', username=u.username)
