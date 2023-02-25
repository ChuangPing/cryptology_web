<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/image/logo.png" alt="" />
        <span>信息共享平台</span>
      </div>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          欢迎DO用户：{{ username }}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix">
            <span @click="loginOut">退出登录</span>
            <el-badge class="mark" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <!-- 左侧边菜单 -->
      <el-aside width="150px">
        <el-menu
          default-active="2"
          background-color="#2d3436"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-menu-item index="1">
            <i class="el-icon-s-data"></i>
            <span slot="title">数据列表</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">数据权限</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">数据审计</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右边主体类容 -->
      <el-main class="main-container">
        <div class="form-container">
          <!-- 线条 -->
          <div class="line"></div>
          <div
            class="aesForm"
            v-loading="loading"
            element-loading-text="AES加密中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            style="width: 50%"
          >
            <div class="logo">
              <!-- <img src="../assets/image/aes.png" alt=""> -->
              <h3>AES</h3>
            </div>
            <el-form
              label-width="80px"
              :model="formAesData"
              :rules="aesFormRules"
            >
              <el-form-item label="数据类型">
                <el-select
                  v-model="formAesData.keyWords"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传文件">
                <input
                  type="file"
                  name="upload"
                  id="upload"
                  ref="aesUploadFileRef"
                />
              </el-form-item>
              <el-form-item label="选择时间">
                <el-date-picker
                  v-model="formAesData.time"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="是否上链">
                <el-switch v-model="formAesData.isShare"> </el-switch>
                <!-- <el-switch v-model="formAesData.isShare"></el-switch> -->
              </el-form-item>
              <el-form-item label="对称秘钥" prop="symmetricKey">
                <el-input
                  placeholder="请输入对称秘钥"
                  v-model="formAesData.symmetricKey"
                  type="password"
                ></el-input>
                <i class="el-icon-info"
                  >网站不会以任何形式存储您的私钥请您妥善保管</i
                >
              </el-form-item>
              <!-- <el-form-item class="btnFun"> -->
              <el-button type="primary" @click="onSubmit" class="leftBtn"
                >立即加密</el-button
              >
              <el-button type="info">取消</el-button>
              <!-- </el-form-item> -->
            </el-form>
          </div>
          <div class="ipfsForm">
            <div class="logo">
              <h3>IPFS</h3>
            </div>
            <el-form label-width="80px" :model="formIpfsData">
              <el-form-item label="上传文件">
                <input type="file" ref="ipfsUploadFileRef" />
                <el-button
                  type="success"
                  @click="uploadToIpfs"
                  class="uploadIpfsBtn"
                  icon="el-icon-upload"
                  plain
                  >上传IPFS</el-button
                >
              </el-form-item>
              <el-form-item label="文件用户">
                <el-input
                  v-model="formIpfsData.ipfsUsername"
                  placeholder="加密文件所属用户"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="是否上链">
                <el-switch v-model="formIpfsData.ipfsIsShare" disabled>
                </el-switch>
              </el-form-item>
              <el-form-item label="文件哈希">
                <el-input
                  type="textarea"
                  v-model="formIpfsData.fileHash"
                  disabled
                ></el-input>
                <i class="el-icon-info info"
                  >在本系统中文件哈希如同私钥一样重要，请您妥善保管不得泄露</i
                >
              </el-form-item>
              <!-- 设置数据访问权限 -->
              <el-form-item label="数据权限"  >
            <el-select v-model="metadata.authority" placeholder="选择身份ID">
          <el-option v-for="item in authority" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
          </el-form-item>
              <el-form-item class="ethBtn">
                <a class="wachFile" href="http://127.0.0.1:5001/webui"
                  >去IPFS查看文件</a
                >
                <el-button type="primary" @click="uploadeEth"
                  >数据上链</el-button
                >
              </el-form-item>
              <!-- <div class="wachFile">
                  <el-link href="http://127.0.0.1:5001/webui" type="success" >去IPFS查看文件 </el-link>
                </div> -->
            </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
let web3 = require("../assets/util/initWeb3");
let contractInstance = require("../assets/eth/eth.js");
import { create } from "ipfs-http-client";
const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });
export default {
  data() {
    // 自定义对称密钥验证函数
    var checkKey = (rule, value, callback) => {
      // 16,24,32位字符串的话，分别对应AES-128，AES-192，AES-256 加密方法
      if (value.length == 16 || value.length == 24 || value.length == 32) {
        callback();
      } else {
        callback(
          new Error(
            "请输入正确的对称密钥：16,24,32位密钥，分别对应AES-128，AES-192，AES-256 加密方法"
          )
        );
      }
    };
    return {
      // loading 状态
      loading: false,
      // 用户名
      username: "",
      // select选择内容
      options: [
        {
          value: "life",
          label: "生活",
        },
        {
          value: "traffic",
          label: "交通",
        },
        {
          value: "medical",
          label: "医疗",
        },
        {
          value: "science",
          label: "科研",
        },
        {
          value: "academic",
          label: "学术",
        },
      ],
        // 数据访问权限
        authority: [
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
      // 表单数据绑定对象
      formAesData: {
        // 用户名
        username: "",
        // 用户邮箱
        email: "",
        // select 选择后的值
        keyWords:"",
        // dataCategory: "",
        // 选择的时间
        time: "",
        // 对称秘钥
        symmetricKey: "",
        // 是否上链
        isShare: false,
        // txt文件
        file: "",
      },
      // 表单验证
      aesFormRules: {
        // 验证对称密钥
        symmetricKey: [
          // { required: true, message: "用户名或邮箱不能为空", trigger: "blur" },
          { required: true, message: "对称密钥不能为空", trigger: "blur" },
          { validator: checkKey, trigger: "blur" },
        ],
      },
      // ipfs上传表单
      formIpfsData: {
        // ipfs表单判断是否上链
        ipfsIsShare: false,
        // ipfs表单  文件用户
        ipfsUsername: "",
        // 数据权限
        authority: "",
        // 上传ipfs文件hash
        fileHash: "",
        // 用户邮箱
        email: "",
        // aes 加密文件名
        aesEncFileName:""
      },
      metadata: {
        // 数据权限
        authority: "",
        // 上传ipfs文件hash
        fileHash: "",
        // 用户邮箱
        email: "",
        // aes 加密文件名
        aesEncFileName:""
      }
    };
  },
  methods: {
    // 退出登录
    loginOut() {
      window.sessionStorage.clear();
      this.$message.success("退出成功");
      this.$router.push("/login");
    },

    onSubmit() {
      //  获取文件描述信息
      this.loading = true;
      var that = this;
      let fileInfo = this.$refs.aesUploadFileRef.files[0];
      console.log(this.$refs.aesUploadFileRef.files[0]);
      this.formAesData.file = fileInfo;
      this.$http({
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "/aes", //自定义上传url
        data: this.formAesData,
      })
        .then((res) => {
          console.log(res);
          // 请求成功
          var data = res.data;

          if (data.code == 200) {
            this.$message.success(data.msg);
            that.loading = false;
            loading.close();
          }
        })
        .catch((res) => {
          that.loading = false;
          // 后端返回错误状态
          var data = res.response.data
          this.$message.error(data.msg);
        });
    },

    // ipfs表单用户点击上传图片
    uploadToIpfs() {
      let that = this;
      var fileInfo = this.$refs.ipfsUploadFileRef.files[0];
      let fileName = fileInfo.name;
      // 将文件名存储
      window.sessionStorage.setItem("aesEncFileNanme",fileName)
      // 查询后台用户ase加密文件信息 /findAesFile
      this.$http({
        method: "get",
        url: "/findAesFile",
        params: {
          username: this.username,
          email: this.formAesData.email,
          fileName: fileName,
        },
      })
        .then((res) => {
          // console.log("res", res)
          // 请求成功
          var data = res.data;

          if (data.code == 200) {
            this.$message.success(data.msg);
            this.formIpfsData.ipfsIsShare = data.isShare;
            this.formIpfsData.ipfsUsername = data.username;
            upload(fileInfo);
          }
        })
        .catch((res) => {
          var data = res.response.data;
          this.$message.error(data.msg);
          // console.log(res);
        });

      // 上传函数
      function upload(fileInfo) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(fileInfo);
        reader.onload = async () => {
          let fileHash = await saveTOIpfs(reader.result);
          fileHash = fileHash.toString();
          that.formIpfsData.fileHash = fileHash;
          // alert(fileHash)
          // 将文件hash上传到以太坊
          // saveToEth(fileHash)
          // console.log("11111111", reader.result)
          // 调用函数上传到ipfs
        };
      }
      // 保存到ipfs
      async function saveTOIpfs(fileArray) {
        // 将文件转换为buffer
        let buffer = Buffer.from(fileArray);
        let result = await ipfs.add(buffer);
        let fileHash = result.path;
        return fileHash;
      }
    },
    // 上传到fabric
    async uploadeEth() {
      // 判断是否有文件哈希
      if (this.formIpfsData.fileHash.trim().length == 0) {
        this.$message.warning("请先上传IPFS获取文件哈希");
        return;
      }
      // 判断用户是否同意上链
      if (this.formIpfsData.ipfsIsShare == false) {
        this.$message.error("文件不进行上链共享");
        return;
      }
      this.metadata.aesEncFileName =window.sessionStorage.getItem("aesEncFileNanme")
      this.metadata.email = window.sessionStorage.getItem("email")
      this.metadata.fileHash = this.formIpfsData.fileHash
      // 调用后端接口完成dataOwner加密
      this.$http({
        method: "post",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        url: "/storeMetadata", //自定义上传url
        data: this.metadata,
      })
        .then((res) => {
          console.log(res);
          // 请求成功
          var data = res.data;

          if (data.code == 200) {
            this.$message.success(data.msg);
          }
        })
        .catch((res) => {
          // 后端返回错误状态
          var data = res.response.data;
          this.$message.error(data.msg);
        });
      // // // 获取当前账户
      // let account = await web3.eth.getAccounts()
      // this.$confirm('当前以太坊账户：'+ account[0] +', 是否继续?', "提示", {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: "warning",
      // })
      //   .then(async () => {
      //     // 将文件上传至以太坊
      //     await contractInstance.methods
      //       .setData(this.formIpfsData.fileHash)
      //       .send({
      //         from: account[0],
      //       })
      //       .then(() => {
      //         that.$message.success("上传成功");
      //       })
      //       .catch(() => {
      //         that.$message.error("上传失败");
      //       });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消",
      //     });
      //   });

      // 将文件上传至以太坊
      // await contractInstance.methods.setData(this.formIpfsData.fileHash).send({
      //    from: account[0]
      // }).then(() => {
      //   that.$message.success("上传成功")
      // }).catch(() => {
      //   that.$message.error("上传失败")
      // })
    },
  },
  // 钩子函数。在渲染页面时获取登录用户信息
  created() {
    this.username = window.sessionStorage.getItem("username");
    this.formAesData.username = window.sessionStorage.getItem("username");
    this.formAesData.email = window.sessionStorage.getItem("email");
    this.formIpfsData.email = window.sessionStorage.getItem("email");
  },
};
</script>
<style scoped>
.home-container {
  height: 100%;
}
.container {
  width: 800px;
  margin: 0 auto;
}
.el-header {
  /* background-color: #373d41; */
  background-color: #2d3436;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-dropdown {
  color: #fff;
  cursor: pointer;
}
.el-header .username {
  font-size: 15px;
  cursor: pointer;
}
.home-container img {
  margin-left: 10px;
  height: 55px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header span {
  margin-left: 15px;
}
.el-aside .el-menu {
  border-right: none;
  height: 100%;
}
/* 内容区域 */
.main-container {
  background-color: #dcdde1;
  pad: 10px;
}
.form-container {
  position: relative;

  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.form-container .line {
  position: absolute;
  left: 50%;
  top: 45px;
  /* margin-top: 30px; */
  height: 80%;
  width: 1px;
  border-right: 1px solid #000;
}
.form-container .title {
  margin-bottom: 10px;
  line-height: 30px;
  position: absolute;
  left: 50%;
  top: 85px;
  transform: translate(-50%);
  color: #e6a23c;
  font-size: 15px;
}
/* 左边aes加密表单区域 */
.form-container .aesForm {
  position: absolute;
  left: 0;
  top: 0;
  padding: 50px 10px 10px 10px;
  width: 50%;
  height: 100%;
  /* border-right: 1px solid #e6a23c; */
  /* background: #ccc; */
}
.aesForm .logo,
.ipfsForm .logo {
  width: 100px;
  position: relative;
  left: 50%;
  transform: translate(-50%);
  top: -40px;
  border-radius: 10px;
  overflow: hidden;
  /* background-color: #fff; */
}
/* 调整输入框大小 */
.el-input /deep/ .el-input__inner {
  width: 300px;
}
.el-select {
  width: 300px;
}
.ipfsForm .info,
.aesForm i {
  color: #e6a23c;
  font-size: 10px;
}
.aesForm .leftBtn {
  margin-left: 30px;
  margin-right: 30px;
}
/* 右边ipfs表单 */
.form-container .ipfsForm {
  position: absolute;
  top: 0;
  right: 0;
  padding: 50px 10px 10px 10px;
  width: 47%;
  height: 100%;
}
.ipfsForm .el-input /deep/ .el-input__inner {
  background-color: #f5f5f5;
  border: none;
}
.ipfsForm .uploadIpfsBtn {
  font-size: 10px;
  margin-left: 60px;
}
/* 设置禁用鼠标后的样式 */
.el-input.is-disabled /deep/ .el-input__inner,
.el-textarea.is-disabled /deep/ .el-textarea__inner {
  color: #000;
}

.ipfsForm .ethBtn {
  margin-top: 40px;

  position: relative;
}
.ipfsForm .wachFile {
  color: #00b894;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: -47px;
}
</style>
