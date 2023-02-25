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
          欢迎DU用户：{{this.trapdoor.DuName }}<i class="el-icon-caret-bottom el-icon--right"></i>
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
        <el-menu default-active="2" background-color="#2d3436" text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="1">
            <i class="el-icon-s-data"></i>
            <span slot="title">关键字列表</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">陷门查询</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main-container">
        <!-- 左边容器 -->
        <div class="container-left">
          <div class="title"> <span>获取数据</span></div>
          <el-form ref="form" :model="form" label-width="90px">
            <!-- 兴趣关键字搜索 -->
            <el-form-item label="兴趣关键字" class="form_item">
              <el-select v-model="form.interestKeyword" placeholder="选择感兴趣的关键字">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-search" @click="findKeywordHandle">查询</el-button>
            </el-form-item>

            <!-- 搜索陷门生成 -->
            <el-form-item label="搜索陷门">
              <el-collapse v-model="form.activeNames" @change="handleChange">
                <el-collapse-item name="1">
                  <template slot="title">
                    关键字信息<i class="el-icon-warning"></i>
                  </template>
                  <!-- 根据兴趣关键字查询的DO用户信息 -->
                  <div><i class="el-icon-s-custom"></i> <span>DO用户：{{ this.keywordInfo.doUsername }}</span></div>
                  <div><i class="el-icon-platform-eleme"></i> <span>DO用户邮箱：{{ this.keywordInfo.doEmail }}</span></div>
                  <div><i class="el-icon-star-on"></i><span>关键字哈希：{{ this.keywordInfo.keywordHash }}</span></div>
                  <div><i class="el-icon-s-opportunity"></i>
                    <span>关键字索引哈希：{{ this.keywordInfo.keywordIndexHash }}</span>
                  </div> <br>
                  <div>
                    <i class="el-icon-success"></i> <span>兴趣关键字查询成功，可以生成该兴趣关键字搜索陷门</span>
                    <!-- <el-divider></el-divider> -->
                  </div>
                  <!-- DU用户公钥上传 -->
                  <!-- 公钥文件：
            <input type="file" name="upload" id="upload" ref="pkUploadFileRef" /> <br> <br> -->
                  <el-button type="primary" @click="trapdoorHandle">请求搜索陷门</el-button>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>

            <!-- 搜索文件 -->
            <el-form-item label="上传文件" >
              <el-upload class="upload-demo" action="action" ref="searchFileUploadRef" :before-upload="beforeUpload"
                :http-request="searchFileUpload">
                <el-button size="medium" type="primary" plain> <i class="el-icon-upload"></i> 点击上传 搜索陷门 / 公钥文件
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传 .properties 文件</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="搜索文件" class="form_item">
              <el-button size="medium" type="primary" plain @click="seachFileCreate"> <i class="el-icon-document"></i> 一键生成搜索文件</el-button>
            </el-form-item>
            <el-form-item label="用户信息" class="form_item">
              <span>{{this.searchFile.DuEmail}}</span>
            </el-form-item>
            <el-form-item label="身份ID" class="form_item">
              <span>{{this.searchFile.Authority}}</span>
            </el-form-item>
            <el-form-item label="搜索索引" class="form_item">
              <span>{{this.searchFile.SearchIndex}}</span>
            </el-form-item>
            <el-form-item label="关键字哈希" class="form_item">
              <span>{{this.searchFile.KeywordHash}}</span>
            </el-form-item>
            <el-form-item label="陷门文件" class="form_item">
              <span>{{this.searchFile.TrapdoorFilePath}}</span>
            </el-form-item>
            <el-form-item label="公钥文件" class="form_item">
              <span>{{this.searchFile.PublicKeyFilePath}}</span>
            </el-form-item>
            <el-form-item label="文件哈希" >
              <el-input type="textarea" v-model="searchFile.FileHash"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getFile">请求数据</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 右边容器 -->
        <div class="container-right">
          <div class="title"> <span>权限申请</span></div>
          <el-form  :model="requestInfo" label-width="100px">
            <!-- <i class="el-icon-collection-tag"></i>个人信息 -->
            <!-- 兴趣关键字搜索 -->
            <el-form-item label="身份ID">
              {{  this.searchFile.Authority}}
              
            </el-form-item>
            <el-form-item label="关键字哈希">
              {{ this.searchFile.KeywordHash}}
              <!-- <el-input  v-model="form.interestKeyword"></el-input> -->
            </el-form-item>
            <el-form-item label="DO用户邮箱">
              {{ this.keywordInfo.doEmail}}
              <!-- <el-input  v-model="form.interestKeyword"></el-input> -->
            </el-form-item>
            <el-form-item label="说明">
          <el-input type="textarea" :v-model="requestInfo.reason"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">申请访问权限</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>

export default {
  data() {
    return {
      // DU 用户感兴趣的关键字
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
        }, {
          value: "car",
          label: "汽车",
        }, {
          value: "educate",
          label: "教育",
        }, {
          value: "food",
          label: "食品",
        },
      ],
      // DU 用户查询兴趣关键字信息后返回的陷门，DO等信息
      keywordInfo: {
        doUsername: "",
        doEmail: "",
        // 关键字哈希
        keywordHash: "",
        keywordIndexHash: "",
        // 关键字字数据是否上链
        isShare: "",
      },
      // DU 用户请求生成陷门数据
      trapdoor: {
        // 服务端要为那个用户生成了搜索陷门保存记录在数据库
        DuName: "",
        DuEmail: "",
        // 关键字哈希
        keywordHash: "",
        // // 公钥文件
        // publicKeyFile:"",
        // keywordIndexHash: "",
      },
      // 搜索文件 索引、身份哈希、搜索陷门、公钥、文件哈希
      form: {
        // DU用户感兴趣的关键字
        interestKeyword: "",
        // DU用户身份id
        Duid: "",
        // DU用户公钥
        // publicKeyFile: "",
        activeNames: "",
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // 搜索文件
      searchFile: {
        DuEmail: "",
        Authority:"",
        SearchIndex: "",
        KeywordHash:"",
        TrapdoorFilePath: "",
        PublicKeyFilePath: "",
        FileHash:"",
      },
      
      //DU 权限申请
      requestInfo: {
        reason:"",
      }
    }

    //DU q廯
    
  },
  methods: {
    // DU查询兴趣关键字函数
    findKeywordHandle() {
      // 清空信息
      this.keywordInfo.DOusername = ""
      this.keywordInfo.DOemail = ""
      this.keywordInfo.keywordIndexHash = ""
      this.keywordInfo.isShare = ""
      this.$http({
        method: "get",
        url: "/interestKeyword",
        params: {
          interestKeyword: this.form.interestKeyword
        }
      }).then((res) => {
        // 请求成功
        var data = res.data;
        if (data.code == 200) {
          this.$message.success(data.msg);
          console.log("ddd", data)
          //对后端返回的信息进行处理
          this.keywordInfo.doUsername = data.username
          this.keywordInfo.doEmail = data.email
          this.keywordInfo.keywordIndexHash = data.keywordIndexHash
          this.keywordInfo.keywordHash = data.keywordHash
          // 信息查询成功后打开关键字信息框
          this.form.activeNames = ['1']
        }
      })
        .catch((res) => {
          // 后端返回错误状态
          var data = res.response.data
          this.$message.error(data.msg);
        });
    },
    // DU用户生成陷门函数
    trapdoorHandle() {
      // 获取上传的公钥文件
      // var fileInfo = this.$refs.pkUploadFileRef.files[0]
      // 初始化数据
      // this.trapdoor.publicKeyFile = fileInfo
      this.trapdoor.keywordHash = this.keywordInfo.keywordHash
      console.log(this.trapdoor)
      this.$http({
        method: "post",
        url: "/trapdoor",
        data: this.trapdoor,
      }).then((res) => {
        console.log(res);
        // 请求成功
        var data = res.data;
        if (data.code == 200) {
          this.$message.success(data.msg);

        }
      })
        .catch((res) => {
          // 后端返回错误状态
          var data = res.response.data
          this.$message.error(data.msg);
        });
    },
    // 搜索文件上传前的构子函数
    beforeUpload(file) {
      const type = file.name.split('.')[1]
      if (type !== 'properties') {
        this.$message({ type: 'error', message: '只支持properties文件格式！' })
        return false
      }
    },
    // 上传搜索文件函数：公钥，搜索陷门
    searchFileUpload(param) {
      let formData = new FormData()
      formData.append('file', param.file) // 传入bpmn文件
      formData.append('duEmail', window.sessionStorage.getItem("email"))
      formData.append('keyword', this.keywordInfo.keywordHash)
      this.$http({
        method: "post",
        url: "/searchFileUpload", //自定义上传url
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
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
    },
    // 一键生成搜索文件
    seachFileCreate() {
      // let formData = new FormData()
      // formData.append('duEmail', window.sessionStorage.getItem("email"))
      // formData.append('keyword', this.keywordInfo.keywordHash)
      // formData.append('doEmail', this.keywordInfo.doEmail)
      // console.log(formData)
      this.$http({
        method: "post",
        url: "/searchFileHash", //自定义上传url
        // data: fomData,
        data: {
          "duEmail": window.sessionStorage.getItem("email"),
          "keyword": this.keywordInfo.keywordHash,
          "doEmail": this.keywordInfo.doEmail
        }
      })
        .then((res) => {
          console.log(res);
          // 请求成功
          var data = res.data;

          if (data.code == 200) {
            this.searchFile.FileHash = data.fileHash
            this.searchFile.PublicKeyFilePath = data.publicKey
            this.searchFile.TrapdoorFilePath = data.trapdoor
            this.searchFile.KeywordHash = this.keywordInfo.keywordHash
            this.searchFile.SearchIndex = this.keywordInfo.keywordIndexHash
            this.searchFile.DuEmail = window.sessionStorage.getItem("email")
            this.searchFile.Authority = window.sessionStorage.getItem("Uid")
            this.$message.success(data.msg);
          }
        })
        .catch((res) => {
          // 后端返回错误状态
          var data = res.response.data;
          this.$message.error(data.msg);
        });
    },
    // handleChange(val) {
    //   console.log(val);
    // },
    // 搜索文件  -- 请求数据
    getFile() {
      console.log(this.searchFile)
      this.$http({
        method: "post",
        url: "/requestFile",
        data: this.searchFile
      }).then((res) => {
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
    },
    // 退出登录
    loginOut() {
      window.sessionStorage.clear();
      this.$message.success("退出成功");
      this.$router.push("/login");
    },
  },

  // 钩子函数。在渲染页面时获取登录用户信息
  created() {
    // 获取登录 DU用户信息
    this.trapdoor.DuName = window.sessionStorage.getItem("username");
    // alert(this.trapdoor.DuName)
    this.trapdoor.DuEmail = window.sessionStorage.getItem("email");
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
  clear: both;
  /* padding: 20px; */
  /* pad: 10px; */
}

.title {
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #000;
  font-size: 1.17em;
  font-weight: bold;
  margin-bottom: 20px;
}

.container-left {
  float: left;
  width: 46%;
  margin: 0 auto;
  padding: 5px 20px;
  /* width: 100%; */
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.container-left .form_item {
  /* background-color: aqua; */
  height: 30px;
  margin-bottom: 10px;
}

.container-right {
  float: right;
  /* width: 700px; */
  width: 46%;
  margin: 0 auto;
  padding: 5px 20px;
  /* width: 100%; */
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
