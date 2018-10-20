// weibo.js
// WEIBO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}

// comment 模板字符串
var commentTemplate = function(comment) {
    var c = `
        <div class="comment-cell" data-id="${comment.id}">
            <span class="comment-username">${comment.username}</span>
            <span>: </span>
            <span class="comment-content">${comment.content}</span>
            <button class="comment-delete">删除</button>
            <button class="comment-edit">编辑</button>
        </div>
    `
    return c
}

var weiboTemplate = function(weibo) {
    //  用循环遍历该 weibo 对象的 comments 构造评论模板字符串，
    var comments = []
    for (var i = 0; i < weibo.comments.length; i++) {
        var comment = weibo.comments[i]
        var commentCell = commentTemplate(comment)
        comments.push(commentCell)
    }
    var comments = comments.join('')
    // 合并评论和微博模板字符串
    var t = `
        <div class="weibo-cell" data-id="${weibo.id}">
            <span class="weibo-content">${weibo.content}</span>
            <span> from </span>
            <span class="weibo-username">${weibo.username}</span>
            <button class="weibo-delete">删除</button>
            <button class="weibo-edit">编辑</button>
            <div class="comments-content">${comments}</div>
            <div>
                <input class='class-input-weiboid' type="hidden" name="weibo_id" value=${weibo.id}>
                <input class='class-input-content' name="content">
                <button class="comment-add">添加评论</button>
            </div>
        </div>
    `
    return t
}

var weiboUpdateTemplate = function(content) {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${content}">
            <button class="weibo-update">更新</button>
        </div>
    `
    return t
}

var commentUpdateTemplate = function(content) {
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}">
            <button class="comment-update">更新</button>
        </div>
    `
    return t
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertUpdateForm = function(content, weiboCell) {
    var updateForm = weiboUpdateTemplate(content)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}

// 插入评论
var insertCommentAdd = function(comment, parent) {
    var commentCell = commentTemplate(comment)
    parent.insertAdjacentHTML('beforebegin', commentCell)
}

var insertCommentUpdateForm = function(content, commentCell) {
    var commentUpdateForm = commentUpdateTemplate(content)
    commentCell.insertAdjacentHTML('beforeend', commentUpdateForm)
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    // weibos = api_weibo_all()
    // process_weibos(weibos)
    apiWeiboAll(function(weibos) {
        log('load all weibos', weibos)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
    // second call
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value

        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(weibo) {
            // 收到返回的数据, 插入到页面中
            insertWeibo(weibo)
            input.value = ""
        })
    })
}


var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        weiboId = self.parentElement.dataset['id']
        apiWeiboDelete(weiboId, function(r) {
            log('apiWeiboDelete', r.message)
            alert(r.message)
            if (r.message == "成功删除 weibo") {
                self.parentElement.remove()
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        var weiboSpan = e('.weibo-content', weiboCell)
        var content = weiboSpan.innerText
        insertUpdateForm(content, weiboCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了更新按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        log('update weibo id', weiboId)
        input = e('.weibo-update-input', weiboCell)
        content = input.value
        var form = {
            id: weiboId,
            content: content,
        }

        apiWeiboUpdate(form, function(weibo) {
            log('apiWeiboUpdate', weibo)
            if (weibo.message == "用户无权限") {
                alert('用户无权限')

            } else {
                var weiboSpan = e('.weibo-content', weiboCell)
                weiboSpan.innerText = weibo.content
            }
            var updateForm = e('.weibo-update-form', weiboCell)
            updateForm.remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventsCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
        log('event', event)
        var self = event.target
        log('被点击的元素', self)
        log(self.classList)
        if (self.classList.contains('comment-add')) {
            log('点到了添加评论按钮')
            var p = self.parentNode
            var weiboid = p.querySelector('.class-input-weiboid').value
            var content = p.querySelector('.class-input-content').value
            p.querySelector('.class-input-content').value = ""
            var form = {
                weibo_id: weiboid,
                content: content,
            }

            log('form', form)
            apiCommentAdd(form, function(comment) {
                insertCommentAdd(comment, p)
            })
        }
    })
}

var bindEventCommentDelete = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('comment-delete')) {
        log('点到了删除按钮')
        commentId = self.parentElement.dataset['id']
        apiCommentDelete(commentId, function(r) {
            log('apiCommentDelete', r.message)
            alert(r.message)
            if (r.message == "成功删除 comment") {
                self.parentElement.remove()
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('comment-edit')) {
        log('点到了编辑按钮')
        commentCell = self.closest('.comment-cell')
        commentId = commentCell.dataset['id']
        var commentSpan = e('.comment-content', commentCell)
        var content = commentSpan.innerText
        insertCommentUpdateForm(content, commentCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentUpdate = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('comment-update')) {
        log('点到了更新按钮')
        commentCell = self.closest('.comment-cell')
        commentId = commentCell.dataset['id']
        log('update comment id', commentId)
        input = e('.comment-update-input', commentCell)
        content = input.value
        var form = {
            id: commentId,
            content: content,
        }

        apiCommentUpdate(form, function(comment) {
            log('apiCommentUpdate', comment)
            if (comment.message == '用户无权限') {
                alert('用户无权限')
            } else {
                var commentSpan = e('.comment-content', commentCell)
                commentSpan.innerText = comment.content
            }
            var commentUpdateForm = e('.comment-update-form', commentCell)
            commentUpdateForm.remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventsCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
