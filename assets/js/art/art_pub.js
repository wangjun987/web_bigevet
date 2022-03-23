$(function() {
    let form = layui.form
    let layer = layui.layer
    initCade()
    initEditor()

    function initCade() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //调用分页
                form.render()
            },
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on('click', function() {
        $('#coverFile').click()
    })
    $("#coverFile").on('change', function(e) {
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        let file = e.target.files[0]
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    let art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])

        fd.append('state', art_state)
            //fd.forEach((v, k) => {})

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败！')
                }
                //赋值
                layer.msg('发表文章成功！')
                location.href = '/article/art_list.html'
            },
        })
    }
})