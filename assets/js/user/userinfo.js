$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function(val) {
            if (Value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间'
            }
        }
    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            //headers: {
            //    Authorization: localStorage.getItem('token') || ''
            //},
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                //赋值
                form.val("formUserInfo", res.data)
            },
            /*         complete: function(res) {
    
                        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                            localStorage.removeItem('token')
                            location.href = '/login.html'
                        }
                    } */
        })
    }

    $("#btnReset").click(function(e) {
        e.preventDefault()
        initUserInfo()
    })

    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                //赋值
                layer.msg('更新用户信息成功！')

                //重新渲染头像
                window.parent.getUserInfo()
            },
        })
    })
})