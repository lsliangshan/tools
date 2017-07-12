<template>
  <form class="com-upload-container" :class="'com-upload-container-' + UUID" :ref="'uploader' + UUID">
    <transition name="preview-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
      <div class="preview" :class="'preview' + UUID" :ref="'preview' + UUID" v-if="dataPreview && previewSrc != ''">
        <img :src="previewSrc" :class="dataProgress && percent != 0 ? 'blur' : ''">
      </div>
    </transition>
    <transition name="progress-transition" enter-active-class="animated-p3 fadeIn" leave-active-class="animated-p3 fadeOut">
      <div class="progress" :class="'progress' + UUID" :ref="'progress' + UUID" v-if="dataProgress && percent != 0">
        <div class="percent">
          <div class="percent-mask" :style="{height: percent + '%'}"></div>
          <span v-text="percent + '%'"></span>
        </div>
      </div>
    </transition>
    <input type="file" name="file" @change="upload($event)">
  </form>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import { getUUID } from '../../utils/index'

  // 更多MIME TYPE: http://www.dreamdu.com/xhtml/mime_type/
  const allMimeType = {
    'doc': 'application/msword',
    'exe': 'application/octet-stream',
    'pdf': 'application/pdf',
    'rtf': 'application/rtf',
    'xls': 'application/vnd.ms-excel',
    'xla': 'application/vnd.ms-excel',
    'ppt': 'application/vnd.ms-powerpoint',
    'tgz': 'application/x-compressed',
    'gtar': 'application/x-gtar',
    'gz': 'application/x-gzip',
    'js': 'application/x-javascript',
    'pub': 'application/x-mspublisher',
    'sh': 'application/x-sh',
    'swf': 'application/x-shockwave-flash',
    'tar': 'application/x-tar',
    'cer': 'application/x-x509-ca-cert',
    'crt': 'application/x-x509-ca-cert',
    'zip': 'application/zip',
    'mp3': 'audio/mpeg',
    'wav': 'audio/x-wav',
    'bmp': 'image/bmp',
    'gif': 'image/gif',
    'jpe': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'css': 'text/css',
    'html': 'text/html',
    'c': 'text/plain',
    'h': 'text/plain',
    'txt': 'text/plain',
    'mov': 'video/quicktime',
    'asr': 'video/x-ms-asf',
    'asf': 'video/x-ms-asf',
    'avi': 'video/x-msvideo',
    'png': 'image/png'
  }

  /**
   * ComUpload组件，文件上传
   * 监听4个属性：（默认 "必选"）
   *        data-accept: 文件类型。
   *        data-max-size: 文件最大容量。
   *        data-action: 文件上传接口地址。
   *        data-body: 文件上传所需的额外参数。【可选】
   *        data-preview: 是否需要显示预览。默认需要。【可选】
   *        data-progress: 是否显示上传进度条。默认需要。【可选】
   * 触发3个事件：
   *        preview: 图片预览（上传文件类型为图片时有效）
   *        beforeSend: 文件上传之前触发，返回false则会取消本次文件上传
   *        progress: 文件上传进度
   *        success: 文件上传成功后回调
   *        error: 文件上传失败后回调
   */
  export default {
    props: ['dataAccept', 'dataMaxSize', 'dataAction', 'dataBody', 'dataPreview', 'dataProgress'],
    data () {
      return {
        UUID: getUUID(),
        previewSrc: '',
        percent: 0
      }
    },
    computed: {
      theme () {
        return this.$store.state.theme
      }
    },
    created () {

    },
    methods: {
      isEmptyObj: function (obj) {
        var t;
        for (t in obj)
          return !1
        return !0
      },
      formatFormData (formData, data) {
        if (!(formData instanceof FormData)) {
          return {}
        }
        let _data = {}
        if (typeof data === 'string') {
          try {
            _data = JSON.parse(data)
          } catch (err) {
            _data = {}
          }
        } else {
          _data = data
        }
        if (!this.isEmptyObj(_data)) {
          for (let key in _data) {
            if (_data.hasOwnProperty(key)) {
              formData.append(key, _data[key])
            }
          }
        }
        return formData
      },
      upload (target) {
        const that = this
        if (target.target.files.length !== 0) {
          const _file = target.target.files[0]
          if (that.dataAccept.split('|').indexOf(_file.name.replace(/.*\.(.*)$/, '$1')) === -1) {
            // 类型不合法
            alert('类型不合法')
          } else {
            if (Number(_file.size) > Number(that.dataMaxSize)) {
              // 文件过大
              alert('文件过大')
            } else {
              // 文件上传
              let formData = new FormData(that.$refs['uploader' + that.UUID])
              formData = that.formatFormData(formData, that.dataBody)
              if (_file.type.indexOf('image/') === 0) {
                // 如果上传文件类型为图片，则提供 preview 事件，用于图片预览
                that.$emit('preview', _file)

                if (that.dataPreview) {
                  // 图片预览
                  const reader = new FileReader()
                  reader.onload = function (evt) {
                    that.previewSrc = evt.target.result
                  }
                  reader.readAsDataURL(_file)
                }
              }
              let _startUploadTime = +new Date
              $.ajax({
                url: that.dataAction,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                crossDomain: true,
                cache: false,
                timeout: 30000,
                xhr: function () {
                  let _xhr = $.ajaxSettings.xhr()
                  if (_xhr.upload) {
                    _xhr.upload.addEventListener('progress', function (e) {
                      that.$emit('progress', e)

                      if (that.dataProgress && e.lengthComputable) {
                        that.percent = (e.loaded / e.total * 100).toFixed(2)
                      }
                    }, false)
                  }
                  return _xhr
                },
                beforeSend: function (xhr) {
                  that.$emit('beforeSend', xhr)
                },
                success: function (res) {
                  that.$emit('success', res)

                  if (that.dataProgress) {
                    let _now = +new Date
                    if (_now - _startUploadTime < 500) {
                      setTimeout(function () {
                        that.percent = 0
                      }, 800)
                    } else {
                      that.percent = 0
                    }
                  }
                },
                error: function (err) {
                  that.$emit('error', err)
                }
              })
            }
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .com-upload-container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    input[type='file'] {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .preview {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      img {
        max-width: 100%;
        max-height: 100%;
        &.blur {
          -ms-filter: blur(2px);
          filter: blur(2px);
        }
      }
    }
    .progress {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      .percent {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: #333;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          width: 100%;
          text-align: center;
          background-color: rgba(255, 255, 255, 0.6);
          z-index: 1;
        }
        .percent-mask {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          -webkit-transition: all .3s linear;
          -moz-transition: all .3s linear;
          -o-transition: all .3s linear;
          transition: all .3s linear;
        }
      }
    }
  }
</style>
