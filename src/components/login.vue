<template>
  <div class="loginContainer">
    <!-- logo -->
    <div class="logo">
      <img src="../assets/image/logo.png" alt="logo">
      <span>信息分享平台统一身份认证</span>

    </div>
    <!-- 登录表单 -->
    <div class="loginForm">
      <p class="title">账号登录</p>
      <div class="info"><i class="el-icon-info"></i>您即将登录信息分享平台</div>
      <el-form
        :model="LoginForm"
        :rules="LoginFormRules"
        ref="LoginFormRef"
        class="login"
      >
        <el-form-item class="form_item" prop="email">
          <el-input
            v-model="LoginForm.email"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item class="form_item" prop="password">
          <el-input
            v-model="LoginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" class="btn"
            >登录</el-button
          >
        </el-form-item>
        <div class="loginInfo">
          <span class="left" @click="toRegister">新用户注册</span>
          <span class="right">忘记密码</span>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (mailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱格式"));
      }
    };
    return {
      // 登录表单数据绑定
      LoginForm: {
        eail: "",
        password: "",
      },
      LoginFormRules: {
        // 验证用户名
        email: [
          // { required: true, message: "用户名或邮箱不能为空", trigger: "blur" },
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        // 验证密码
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 跳转到注册页面
    toRegister() {
      this.$router.push("/register");
    },
    // 登录函数
    onSubmit() {
      this.$refs.LoginFormRef.validate((validate) => {
        if (!validate)
          return this.$message.error("登录信息校验不通过，登录失败！");
        // 发送登录请求
        this.$http
          .post("/login", this.LoginForm)
          .then((res) => {
            // 请求成功
            var data = res.data;
            console.log(data)
            if (data.code == 200) {
              // 注册成功
              this.$message.success(data.msg);
              // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
              //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
              //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
              window.sessionStorage.setItem("email", data.email)
              window.sessionStorage.setItem("token", data.token)
              window.sessionStorage.setItem("username", data.username)
              window.sessionStorage.setItem("Uid", data.uid)
              // 根据用户角色跳转到对应的页面
              if (data.role == "1") {
                this.$router.push("/dataUser");
              }else if (data.role == "0") {
                this.$router.push("/dataOwner");
              }else {
                this.$message.error("用户非法")
                // this.$router.push("/login");
              }
            }
          })
          .catch((res) => {
            // 失败回调，后端返回错误状态
              var data = res.response.data
              this.$message.error(data.msg)
          });
      });
    },
  },
};
</script>
<style scoped>
/* 背景 */
.loginContainer {
  width: 100%;
  height: 100%;
  background-image: url(../assets/image/background1.jpg);
  /* 背景图垂直、水平均居中 */
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-attachment: fixed;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
}
.loginContainer:before {
  content: "";
  position: fixed;
  background-color: #000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.48;
}
/* logo */
.logo {
  /* clear: both; */
  position: relative;
  left: 50%;
  /* transform: translate(-57%); */
  transform: translate(-67%);
  /* width: 100%; */
  height: 80px;
  text-align: center;
  z-index: 9999;
  padding-top: 64px;
  margin: 0 auto;
  /* width: 100px; */
  /* background-color: pink; */
}
/* .logo img {
  position: absolute;
} */
.logo span {
  position: absolute;
  width: 306px;
  height: 26px;
  line-height: 26px;
  font-size: 23px;
  top: 82px;
  left: 1050px;
  font-size: 24px;
  color: #fff;
  border-left: 1px solid #fff;
  padding-left: 17px;
}
/* 登录表单 */
.loginForm {
  margin-top: 58px;
  width: 282px;
  height: 300px;
  background-color: #fff;
  /* opacity: 0.9; */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 1px 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 12px;
  /* padding: 10px 18px; */
}

.loginForm p {
  color: #333;
  font-weight: bold;
  margin-left: 100px;
  /* border-bottom: 1px solid #ebeef5 */
}
.loginForm .info {
  height: 23px;
  margin: 2px auto;
  /* text-align: center; */
  color: #f09238;
  font-size: 12px;
  background-color: #fff5eb;
  line-height: 23px;
  margin: 10px 0;
  padding-left: 20px;
}
.login {
  padding: 25px 20px;
}
/* 样式穿透：1. /deep/  2. >> -- */
/* 调整elementUI中input样式 */
.el-input /deep/ .el-input__inner {
  background-color: #f5f5f5;
  border: none;
}
/* 调整elementUI input图标样式 */
.el-input /deep/ .el-input__prefix {
  color: #000;
  font-size: 18px;
}
.btn {
  width: 100%;
}

.loginInfo {
  position: relative;
  top: -10px;
  font-size: 10px;
  color: #606266;
}
.loginInfo .left {
  cursor: pointer;
  float: left;
}
.loginInfo .left:hover {
  color: #67c23a;
}
.loginInfo .right {
  cursor: pointer;
  float: right;
}
</style>
