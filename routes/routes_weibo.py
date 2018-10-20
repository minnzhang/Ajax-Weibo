import functools

from models.comment import Comment
from models.weibo import Weibo
from routes import (
    current_user,
    login_required,
)
from utils import log

from flask import (
    request,
    jsonify,
    Blueprint,
    render_template,
)

bp = Blueprint('routes_weibo', __name__)


@bp.route('/weibo/index', methods=['GET'])
@login_required
def index():
    """
    weibo 首页的路由函数
    """
    u = current_user()
    weibos = Weibo.find_all(user_id=u.id)
    # 替换模板文件中的标记字符串
    return render_template(
        'weibo_index.html',
        weibos=weibos,
        user=u,
    )


def weibo_owner_required(route_function):
    @functools.wraps(route_function)
    def f():
        log('same_user_required')
        u = current_user()
        if 'id' in request.args:
            weibo_id = request.args['id']
        else:
            weibo_id = request.get_json()['id']
        w = Weibo.find_by(id=int(weibo_id))

        if w.user_id == u.id:
            return route_function()
        else:
            d = dict(
                message="用户无权限"
            )
            return jsonify(d)

    return f


def comment_owner_required(route_function):
    @functools.wraps(route_function)
    def f():
        u = current_user()
        if 'id' in request.args:
            comment_id = request.args['id']
        else:
            comment_id = request.get_json()['id']
        c = Comment.find_by(id=int(comment_id))
        w = Weibo.find_by(id=c.weibo_id)
        if c.user_id == u.id:
            return route_function()
        elif w.user_id == u.id:
            return route_function()
        else:
            d = dict(
                message="用户无权限"
            )
            return jsonify(d)

    return f
