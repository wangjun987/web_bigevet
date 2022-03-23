$(function() {
    let form = layui.form
    let layer = layui.layer
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            },
        })
    }

    let indexAdd = null
    $("#btnAddCate").on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //代理绑定
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败！')
                    }
                    //赋值
                    initArtCateList()
                    layer.msg('新增分类成功！')
                        //根据索引关闭对应的弹出层
                    layer.close(indexAdd)
                },
            })
        })
        /* 编辑 */
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-Edit').html()
        });
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'POST',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            },
        })
    })

    $('body').on('submit', '#form-Edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit)
                        //赋值
                    initArtCateList()
                },
            })
        })
        /* 删除 */
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                },
            })
        })
    })
})