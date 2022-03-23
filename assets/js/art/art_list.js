$(function() {
    let form = layui.form
    let layer = layui.layer
    let laypage = layui.laypage;
    //美化时间
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date()
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d}''${hh}:${mm}"${ss}`
    }

    function padZero(n) {
        return n > 9 ? n : 'o' + n
    }

    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //显示2页
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()

    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用分页
                renderPage(res.total)
            },
        })
    }

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            },
        })
    }

    //筛选表单
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
            //查询参数对象q
        q.cate_id = cate_id
        q.state = state
            //更具最新的筛选条件，名筛选数据
        initTable()
    })

    //渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) { //分页发生切换用
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.linit
                    //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        })
    }
    //删除
    $('tbody').on('click', '.btn-delete', function() {
        let len = $(".btn-delete").length
        let id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    //layer.close(index)
                    initTable()
                }
            })
        })
    })
})