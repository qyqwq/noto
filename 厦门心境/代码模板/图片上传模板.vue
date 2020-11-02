<template>
  <div>
    <el-upload
      ref="upload"
      :class="['load_content',hideUpload? 'hideUpload':'']"
      action="#"
      :http-request="imgUpload"
      :limit="imglimit"
      :file-list="imgList"
      list-type="picture-card"
      :on-change="fileChange"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeImgUpload"
      accept="image/*"
      multiple
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :modal="false" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      OSS: process.env.OSS,

      // 图片上传部分
      imgList: [], // 图片列表
      hideUpload: false,
      imglimit: 5, // 最大上传数
      thaw_form_error: false,
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    getImg(){
      var imgString = (() => {
          var a = ''
          this.imgList.forEach((e, k) => {
            if (k) {
              a += ','
            }
            a += e.oss_url
          })
          return a
        })() // 图片字符串 用,分割
    },
    // 图片上传部分
    getImgOssUrl() {
      var a = "";
      for (let i = 0; i < this.imgList.length; i++) {
        const e = this.imgList[i];
        if (i) {
          a += ",";
        }
        a += e.oss_url;
      }
      return a;
    },
    // 图片上传
    imgUpload(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      upload(formData)
        .then((res) => {
          // 保存url
          this.fileChange(
            {
              uid: param.file.uid,
              oss_url: this.OSS + res.data,
            },
            [],
            2
          );
          param.onSuccess();
          if (this.imgList.length >= this.imglimit) {
            this.hideUpload = true;
          }
          // console.log(this.imgList);
        })
        .catch((res) => {
          console.log(res);
          this.$message.error("网络错误");
        });
    },
    fileChange(file, fileList, state = 1) {
      // 设置oss地址
      if (state == 2) {
        for (let i = 0; i < this.imgList.length; i++) {
          const e = this.imgList[i];
          if (e.uid == file.uid) {
            e.oss_url = file.oss_url;
          }
        }
      } else {
        this.imgList = fileList.concat();
      }
    },
    handleRemove(file, fileList) {
      // console.log(file,fileList);
      this.imgList = fileList.concat();
      // console.log(this.imgList);
      if (this.imgList.length < this.imglimit) {
        this.hideUpload = false;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeImgUpload(file) {
      const isJPG = e.type === 'image/jpeg'
      const isPNG = e.type === 'image/png'
      const isBMP = e.type === 'image/bmp'
      if (!isJPG && !isPNG && !isBMP) {
        this.$message.warning('上传照片只能是 JPG/PNG/BMP 格式!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isLt2M;
    },
    // 图片部分结束
  },
};
</script>
<style>
/* .el-dialog {
    margin: 5vh 15vh !important;
} */
.thaw_imgupload {
  overflow-x: auto;
  overflow-y: hidden;
}
.thaw_imgupload .load_content {
  display: flex;
  flex-direction: row-reverse;
  width: max-content;
}
.thaw_imgupload .el-upload.el-upload--picture-card {
  margin-right: 10px;
}
.hideUpload .el-upload.el-upload--picture-card {
  display: none;
}
.thaw_imgupload .el-upload-list.el-upload-list--picture-card {
  overflow-x: scroll;
  overflow-y: hidden;
}
.thaw_imgupload
  .el-upload-list.el-upload-list--picture-card::-webkit-scrollbar {
  display: none;
}
.el-textarea .el-input__count {
  background: transparent;
}
</style>