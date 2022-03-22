//切换登录
$(function() {
    $("#link_reg").on('click', function() {
        $(".login-box").hide()
        $(".reg-box").show()
    })
    $("#link_login").on('click', function() {
        $(".login-box").show()
        $(".reg-box").hide()
    })

    //从LAYUI中获取
    let form = layui.form
    form.verify({
        username: function(value, item) {
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            let pass = $(".reg-box [name=password]").val()
            if (pass !== value) {
                return '两次密码不一致！'
            }
        }
    });
    let layer = layui.layer
        //监听注册表单
    $("#form_reg").on('submit', function(e) {
            e.preventDefault()
            let data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)

                }
                layer.msg('注册成功，请登录！')
                $("#link_login").click()
            })
            layer.msg('注册成功，请登录！')
            $("#link_login").click()
        })
        //监听登录表单
    $("#form_login").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功！')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
        location.href = '/index.html'
    })
})