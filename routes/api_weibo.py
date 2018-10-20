from models.comment import Comment
from models.user import User
from routes.routes_weibo import weibo_owner_required, comment_owner_required
from utils import log
from routes import current_user, login_required
from models.weibo import Weibo

from flask import (
    jsonify,
    request,
    Blueprint,

)

bp = Blueprint('api_weibo', __name__)


@bp.route('/api/weibo/all', methods=['GET'])
@login_required
def all():
    log('执行 all 函数')
    weibos = Weibo.all_json()
    # log('weibos---', weibos)
    for weibo in weibos:
        u = User.find_by(id=weibo['user_id'])
        weibo['username'] = u.username
        cs = Comment.find_all(weibo_id=weibo['id'])
        cs = [c.json() for c in cs]
        weibo['comments'] = []
        for c in cs:
            u = User.find_by(id=c['user_id'])
            c['username'] = u.username
            weibo['comments'].append(c)
    # log('weibo---', weibos)
    return jsonify(weibos)


@bp.route('/api/weibo/add', methods=['POST'])
@login_required
def add():
    form = request.get_json()
    # 创建一个 weibo
    u = current_user()
    w = Weibo.add(form, u.id, u.username)
    # 把创建好的 weibo 返回给浏览器
    return jsonify(w.json())


@bp.route('/api/weibo/delete', methods=['GET'])
@login_required
@weibo_owner_required
def delete():
    weibo_id = int(request.args['id'])
    Weibo.delete(weibo_id)
    d = dict(
        message="成功删除 weibo"
    )
    return jsonify(d)


@bp.route('/api/weibo/update', methods=['POST'])
@login_required
@weibo_owner_required
def update():
    """
    用于增加新 weibo 的路由函数
    """
    form = request.get_json()
    log('api weibo update form', form)
    w = Weibo.update(form)
    return jsonify(w.json())


@bp.route('/api/comment/add', methods=['POST'])
@login_required
def comment_add():
    log('添加评论')
    form = request.get_json()
    u = current_user()
    w = Weibo.find_by(id=int(form['weibo_id']))
    c = Comment.add(form, u.id, u.username, w.id)
    # log('c---', c)
    return jsonify(c.json())


@bp.route('/api/comment/delete', methods=['GET'])
@login_required
@comment_owner_required
def comment_delete():
    comment_id = int(request.args['id'])
    Comment.delete(comment_id)
    d = dict(
        message="成功删除 comment"
    )
    return jsonify(d)


@bp.route('/api/comment/update', methods=['POST'])
@login_required
@comment_owner_required
def comment_update():
    form = request.get_json()
    c = Comment.update(form)
    return jsonify(c.json())
