initPluploadBox: async function ($elm, config) {

    var staticFiles = await fnHelp.asyncAJAX({
        url: await fnDataTransmission.getUrl("GetChildItemFileInfo", "SystemApi"),
        type: "POST",
        dataType: "json",
        data: {
            superiorFolderId: config.superiorFolderId,
            token: config.token,
        }
    });

    var _SelfConfig = {
        
    };

    var options = {
        chunk_size: '512KB',
        url: await fnDataTransmission.getUrl("UploadFileByChunk", "SystemApi"),
        staticFiles: staticFiles,
        //删除操作
        deleteActionOnDone: function (file, doRemoveFile) {
            (async () => {
                try {
                    var result = await fnHelp.asyncAJAX({
                        url: await fnDataTransmission.getUrl("DeleteFile", "SystemApi"),
                        type: "POST",
                        dataType: "json",
                        data: {
                            filehandle: file.filehandle,
                            token: file.token,
                        }
                    });
                    if (result.result == "ok") {
                        doRemoveFile(file);
                    } else {
                        new $.zui.Messager('文件删除失败', {
                            type: 'warning', // 定义颜色主题
                            placement: 'right-bottom' // 定义显示位置
                        }).show();
                    }
                } catch (e) {
                    new $.zui.Messager('文件删除失败', {
                        type: 'warning', // 定义颜色主题
                        placement: 'right-bottom' // 定义显示位置
                    }).show();
                }
            })();
            return false;

        },
        //上传类型 上传大小 是否重复
        filters: {
            mime_types: [
                { title: '图片', extensions: 'jpg,gif,png' }
            ],
            max_file_size:imageSize,
            prevent_duplicates:false
        },
        limitFilesCount:2, //上传数目
        autoUpload: true, //自动上传
        dropPlaceholder:"拖拽到此处更改背景",
        multi_selection:false, //是否可多选文件
        renameByClick: false, //是否允许文件重命名
        //上传前
        onBeforeUpload: function (file) {
            _uploadTargetDom.toggleClass('loading');
        },
        //文件上传完成 回调
        onFileUploaded: function (file, responseObject) {
            if (responseObject.status == 200) {
                this.removeFile(file);
                //更新img
                var url = JSON.parse(responseObject.response).url;
                imgDom.attr("src",url);
                imageSrcDom.val(url);
            }
            _uploadTargetDom.toggleClass('loading');
        },
    };



    Object.assign(_SelfConfig, config);
    var telm = $elm.uploader(_SelfConfig).data('zui.uploader');
    var pluploadinfo = telm.plupload;
    pluploadinfo.bind("BeforeUpload", function (uploader, file) {
        (async () => {
            try {
                var fileInfo = await fnHelp.asyncAJAX({
                    url: await fnDataTransmission.getUrl("TouchFile", "SystemApi"),
                    type: "POST",
                    dataType: "json",
                    data: {
                        fileName: file.name,
                        ext: file.ext,
                        fileType: file.type,
                        superiorFolderId: config.superiorFolderId,
                        token: config.token,
                    }
                });
                file.filehandle = fileInfo.content.filehandle;
                file.token = fileInfo.content.token;
                file.status = plupload.UPLOADING;
                uploader.trigger("UploadFile", file);
            } catch (e) {
                file.status = plupload.UPLOADING;
                uploader.trigger("UploadFile", file);
            }
        })()

        return false;
    });

    pluploadinfo.bind("BeforeChunkUpload", function (uploader, file, post_args, chunkBlob, offset, callback) {
        var filereader = new FileReader();
        filereader.onload = function () {
            post_args.filehandle = file.filehandle;
            post_args.token = file.token;
            post_args.hashsign = $.npm.sha256(filereader.result);
            post_args.totalsize = file.size;
            post_args.chunk_size = uploader.getOption().chunk_size;
            callback();
        };
        filereader.readAsArrayBuffer(chunkBlob.getSource());

        return false;
    });



    return telm;
}