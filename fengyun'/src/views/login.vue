<template>
  <div class="content-wrapper">
    <van-popup class="top-tip" v-model="showTips" position="top" :overlay="false">{{tipsText}}</van-popup>
    <div class="loading" v-if="loading" style="z-index: 2018">
      <van-loading color="white" size="100px" />
    </div>
    <div class="banner">
        <img src="@/assets/images/theme.png" >
    </div>
    <div class="time">
        <img src="@/assets/images/time.png">
    </div>
    <div class="content">
      <section class="phone">
        <input type="tel" v-model="phone"
          :placeholder="phoneErr ? (phone === '' ? '请输入手机号' : '请输入正确的手机号')  : '请输入注册手机号'"
          :class="[phoneErr && 'err', currentInput === 'phone' && 'checked' ]" @blur="scrollBack"
          :disabled="phoneDisabled">
      </section>
      <section class="code">
        <input type="tel" v-model="code" :placeholder="codeErr ? '请输入验证码' : '请输入验证码'"
          @blur="scrollBack" :class="[codeErr && 'err', currentInput === 'code' && 'checked' ]">
        <input type="button" v-model="button_text" @click="sendCode" :disabled="phoneErr">
      </section>
      <section class="submit">
        <input type="button" :disabled="phoneErr || codeErr" value="确定" @click="submit">
      </section>
    </div>
    <div class="tip">
      <span>网贷有风险&nbsp;出借需谨慎</span><br>
      <!-- <span>本活动最终解释权归成都融证通互联网信息服务有限公司所有</span> -->
    </div>
  </div>
</template>
<script>
  import '../assets/svg/icon.js'
  import request from '../utils/request.js'
  export default {
    data() {
      return {
        button_text: '获取验证码',
        phone: '',
        phoneErr: false,
        phoneDisabled: false,
        code: '',
        codeErr: false,
        loading: false,
        blurPosition: false,
        showKeyboard: false,
        currentInput: '',
        showTips: false,
        tipsText: '',
      }
    },
    created() {
      if (window.localStorage.getItem('tokenB')) {
        this.$router.push('/')
      }
    },
    methods: {
      sendCode() {
        if (this.testPhone()) {
          this.showTips = true
          this.tipsText = '请输入手机号'
          setTimeout(() => {
            this.showTips = false
          }, 1500)
          return
        }
        this.loading = true
        request({
          url: '/security/sendCode',
          data: {
            phone: this.phone,
            type: 'rank'
          }
        }).then(data => {
          this.loading = false
          if (data.success) {
            let countDown = 60
            this.button_text = `${countDown}s`
            this.phoneDisabled = true
            const timer = setInterval(() => {
              if (countDown > 0) {
                countDown--
                this.button_text = `${countDown}s`
              } else {
                window.clearInterval(timer)
                this.button_text = '重新获取'
                this.disabled = false
                this.phoneDisabled = false
              }
            }, 1000)
            this.showTips = true
            this.tipsText = '验证码发送成功，请注意查收'
            setTimeout(() => {
              this.showTips = false
            }, 1500)
          } else {
            this.showTips = true
            this.tipsText = data.errorDescription || '系统繁忙'
            setTimeout(() => {
              this.showTips = false
            }, 1500)
            if (data.error === 'PHONE_UNREGISTERED') {
              this.$dialog.confirm({
                lockScroll: false,
                message: '账号未注册，注册完成后可参与冲顶，是否去注册？'
              }).then(() => {
                window.location.href = 'https://m.139lc.com/views/dl/register/register.html'
              }).catch(() => {
                // on cancel
              });
            }
          }
        }).catch(() => {
          this.loading = false
          this.showTips = true
          this.tipsText = '系统繁忙请重试'
          setTimeout(() => {
            this.showTips = false
          }, 1500)
        })
      },
      testPhone() {
        const bo = !(/^1[345789]\d{9}$/.test(this.phone))
        this.phoneErr = bo
        return bo
      },
      testCode() {
        const bo = !(/^\d{6}$/.test(this.code))
        this.codeErr = bo
        return bo
      },
      submit() {
        if (this.testPhone() || this.testCode()) {
          return
        }
        this.loading = true
        request({
          url: '/security/login',
          data: {
            phone: this.phone,
            code: this.code,
            type: 'rank'
          }
        }).then(data => {
          this.loading = false
          console.log(data)
          if (data.success && data.result) {
            window.localStorage.setItem('tokenB', data.result)
            this.$router.push('/info')
          } else {
            this.showTips = true
            this.tipsText = data.errorDescription || '系统繁忙'
            setTimeout(() => {
              this.showTips = false
            }, 1500)
          }
        }).catch(() => {
          this.loading = false
          this.showTips = true
          this.tipsText = data.errorDescription || '系统繁忙请重试'
          setTimeout(() => {
            this.showTips = false
          }, 1500)
        })
      },

    //输入框失焦之后回弹底部
     scrollBack(){        
        window.scroll(0, 0);
      }     
    },
    watch: {
      phone() {
        this.testPhone()
      },
      code() {
        this.testCode()
      }
    }
  }

</script>
<style lang="less" scoped>
  .top-tip {
    text-align: center;
    background: #fb471e;
    font-size: 24px;
    color: #fff;
    line-height: 2em;
  }

  .content-wrapper {
    min-height: 100vh;
    max-width: 100vw;
    width: 100vw;
    background: url('../assets/images/bg.png') no-repeat center center;
    background-size: 100% 100%;
    font-size: 28px;

    position: relative;

    .banner{
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      img{
        width: 635px;
      }
    }
    
    .time{ 
      margin-top: 500px;
      text-align: center;
      img{
        width: 670px;
      }
    }

    .content {
      padding: 0 88px;
      width: 100%;
      margin-top: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      section {
        display: flex;
        width: 100%;
        margin-bottom: 30px;

        >input {
          border: none;
          outline: none;
          line-height: 28px;
          padding: 30px 0;
          border-radius: 50px;
          text-align: center;
          width: 100%;

          // &.checked {
          //   background: #eee;
          // }

          &.err {
            &::placeholder {
              color: #fe6d57;
            }

            color: #fe6d57;
          }

          &::placeholder {
            color: #aeaeae;
            font-size: 28px;
            line-height: 1em; //解决不垂直居中的问题
          }

          &[disabled] {
            background: #DEE1E6;
          }
        }

        &.phone {
          position: relative;

          .icon {
            fill: #fff;
            width: 88px;
            height: 88px;
            position: absolute;

            &.left {
              left: -80px;
            }

            &.right {
              right: -75px;
            }
          }
        }

        &.code {
          justify-content: space-between;
          margin-bottom: 52px;

          >input:first-child {
            width: 180%;
            margin-right: 20px;
          }

          >input:last-child {
            background: #f8feb3;
            color: #000000;
          }
        }

        &.submit {
          >input {
            background: #fed04f;
            font-size: 32px;
            color: #000000;
            font-weight: 500;
          }
        }
      }
    }

    .tip {
      width: 100%;
      font-size: 22px;
      color: #ffffff;
      text-align: center;
      line-height: 1.8em;
      padding: 42px 0;
      span:first-of-type{
        font-size: 28px;
      }

      @media (max-width: 374px) {
        >span {
          display: inline-block;
          padding: 0 56px;
        }
      }
    }

    /deep/.keyboard {
      .van-number-keyboard__title {
        display: flex;
        // justify-content: center;
        align-items: center;
        height: 60px;
      }

      .van-number-keyboard__close {
        font-size: 28px;
      }

      .van-key {
        font-size: 28px;
        line-height: 80px;
        height: 80px;
      }
    }

    .loading {
      position: fixed;
      top: 0;
      left: 0;
      background: #000;
      width: 100vw;
      height: 100vh;
      opacity: .2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

</style>
