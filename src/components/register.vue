<template>
  <div class="registerContainer">
    <!-- 注册表单区域 -->
    <div class="register_box" >
      <!-- 标题 -->
      <div class="title">
        <h3>欢迎注册</h3>
        <p>已有账号? <span @click="toLogin">登录</span></p>
      </div>
      <!-- 注册表单 -->
      <div class="registerForm">
        <el-form
          label-width="80px"
          :model="RegisterForm"
          :rules="RegisterFormRules"
          ref="RegisterFormRef"
        >
          <el-form-item label="用户类型" class="form_item" prop="role">
            <el-radio
            @click.native="roleHandle"
              v-model="RegisterForm.role"
              label=1
              class="radio_margin"
              >数据使用者</el-radio
            >
            <el-radio
            @click.native="roleHandle"
              v-model="RegisterForm.role"
              label=0
              class="radio_margin"
              >数据拥有者</el-radio
            >
          </el-form-item>
          <el-form-item v-if="isDU" label="身份ID" class="form_item"  prop="uid">
            <el-select v-model="RegisterForm.uid" placeholder="选择身份ID">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
          </el-form-item>
          <el-form-item label="用户名" class="form_item" prop="username">
            <el-input v-model="RegisterForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" class="form_item" prop="password">
            <el-input v-model="RegisterForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            class="form_item"
            prop="verifyPassword"
          >
            <el-input v-model="RegisterForm.verifyPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" class="form_item" prop="email">
            <el-input v-model="RegisterForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="btn"
              >立即注册</el-button
            >
            <el-button type="danger" @click="clearForm">重置表单</el-button>
          </el-form-item>
          <p class="isAgree">
            <el-checkbox v-model="isAgree"
              >我已阅读并且同意信息分享平台的<span
                >《使用协议》</span
              ></el-checkbox
            >
          </p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 验证用户类型合法性
    // var validateUserType = (rule, value, callback) => {
    //   if (value != 0 || value != 1) {
    //     callback(new Error("注册用户类型非法"));
    //   }
    //   callback();
    // };
    // 验证两次密码一致性
    var validatePassword = (rule, value, callback) => {
      if (value !== this.RegisterForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
    };
    return {
      // DU用户身份
      options: [
        {
          value: "life",
          label: "旅行家",
        },
        {
          value: "traffic",
          label: "交警",
        },
        {
          value: "medical",
          label: "医生",
        },
        {
          value: "science",
          label: "科学家",
        },
        {
          value: "academic",
          label: "学生",
        },
      ],
      // 是否为DU用户
      isDU: false,
      // 注册表单数据绑定对象
      RegisterForm: {
        // 1:数据使用者 0：数据拥有者
        role: 1,
        // uid DU用户注册身份
        uid:"",
        username: "",
        password: "",
        verifyPassword: "",
        email: "",
      },
      // 注册表单验证规则
      RegisterFormRules: {
        // 验证用户类型
        role: [
          { required: true, message: "请选择注册用户类型", trigger: "blur" },
          // { validator: validateUserType, trigger: "change" },
        ],
        // 验证用户身份
        uid: [
            { required: true, message: "选择用户身份ID", trigger: "blur" },
        ],
        // 验证用户名
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
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
        // 验证确认密码
        verifyPassword: [
          { validator: validatePassword, trigger: "blur" },
        ],
        // 验证邮箱
        email: [
            { required: true, message: "邮箱不能为空", trigger: "blur" },
            {validator: checkEmail, trigger: "blur"}
        ],
      },
      // 是否勾选协议
      isAgree: "",
    };
  },
  methods: {
    // 提交注册函数
    onSubmit() {
      console.log(this.RegisterForm)
      if (this.isAgree) {
        // 判断提交表单是否通过验证
        this.$refs.RegisterFormRef.validate( validate => {
          if (!validate) return this.$message.error("注册信息校验不通过，注册失败！")
            console.log(this.RegisterForm)
            this.$http.post("/register", this.RegisterForm).then(res => {
              // 请求成功
               var data = res.data
              if (data.code == 200) {
                // 注册成功
                 this.$message.success(data.msg)
                 // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                this.$router.push("/login")
              }
            }).catch(res => {
              // 后端返回错误状态
              var data = res.response.data
              this.$message.error(data.msg)
              console.log("cacth:", res.response.data)
            })

          // console.log(res[0])
        })
      } else {
        // 提示用户勾选协议
        this.$message.warning("请勾选协议")
      }
    },
    // 重置表单函数
    clearForm() {
      this.$refs.RegisterFormRef.resetFields()
    },
    // 跳转到登录页面
    toLogin() {
      this.$router.push("/login")
    },
    roleHandle() {
      // alert(11)
      if (this.RegisterForm.role == 1) {
        console.log(this.RegisterForm.role)
        this.isDU = false

      }
      if (this.RegisterForm.role == 0) {
        console.log(this.RegisterForm.role)
        this.isDU = true

      }
    }
  },
};
</script>
<style scoped>
/* 背景 */
.registerContainer {
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
.registerContainer:before {
    content: "";
    position: fixed;
    background-color: #000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: .48;
}
/* 注册表单 */
.register_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  /* height: 554px; */
  height: 620px;
  background: #fff;
  /* opacity: 0.9; */
  border-radius: 12px;
  box-shadow: 1px 2px 12px 0 rgb(0 0 0 / 10%);
}
.register_box .title {
  margin: 30px 0 0 39px;
}
.register_box .title h3 {
  font-size: 36px;
  color: #000;
  padding-bottom: 4px;
  margin: 0;
}
.register_box .title p {
  margin: 0;
  font-size: 14px;
  color: #9b9b9b;
}
.register_box .title span {
  margin-left: 5px;
  color: #2e58ff;
  cursor: pointer;
}
/* 注册表单 */
.registerForm {
  padding: 40px 20px 0 20px;
  width: 440px;
  height: 425px;
  /* background: #cacaca; */
}
.registerForm .form_item {
  /* margin-bottom: 32px; */
  background-color: #fff;
}
.registerForm .radio_margin {
  margin-left: 50px;
}
.registerForm .isAgree {
  color: #333;
  font-size: 12px;
  margin-left: 66px;
}
.registerForm .isAgree span {
  color: #409EFF;
}
.registerForm .btn {
  margin-right: 120px;
}
.registerForm.isAgree span {
  color: orange;
  cursor: pointer;
}
</style>
