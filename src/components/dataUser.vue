<template>
  <div class="container">
    <h1>DataUser</h1>
    <el-form ref="form" :model="form" label-width="90px">
      <!-- 兴趣关键字搜索 -->
      <el-form-item label="兴趣关键字">
        <el-select v-model="form.interestKeyword" placeholder="选择感兴趣的关键字">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
            <div><i class="el-icon-s-custom"></i> <span>DO用户：{{ this.keywordInfo.DOusername }}</span></div>
            <div><i class="el-icon-platform-eleme"></i> <span>DO用户邮箱：{{ this.keywordInfo.DOemail }}</span></div>
            <div><i class="el-icon-star-on"></i><span>关键字哈希：{{this.keywordInfo.keywordHash}}</span></div>
            <div><i class="el-icon-s-opportunity"></i>
              <span>关键字索引哈希：{{ this.keywordInfo.keywordIndexHash }}</span></div> <br>
              <div>
                <i class="el-icon-success"></i> <span>兴趣关键字查询成功，可以生成该兴趣关键字搜索陷门</span>
                <el-divider></el-divider>
                </div>
              <!-- DU用户公钥上传 -->
                <!-- 公钥文件：
            <input type="file" name="upload" id="upload" ref="pkUploadFileRef" /> <br> <br> -->
            <el-button type="primary" @click="trapdoorHandle">请求搜索陷门</el-button>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>

      <!-- 搜索文件 -->
      <el-form-item label="搜索文件">
        <el-select v-model="form.Duid" placeholder="选择感兴趣的关键字">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
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
        DOusername: "",
        DOemail: "",
        // 关键字哈希
        keywordHash: "",
        keywordIndexHash: "",
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
        Duid:"",
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
      }
    }
  },
  methods: {
    // DU查询兴趣关键字函数
    findKeywordHandle() {
      // 清空信息
      this.keywordInfo.DOusername = ""
      this.keywordInfo.DOemail = ""
      this.keywordInfo.keywordIndexHash = ""
      this.form.activeNames = ""
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
          this.keywordInfo.DOusername = data.username
          this.keywordInfo.DOemail = data.email
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
    handleChange(val) {
      console.log(val);
    },
    onSubmit() {
      console.log('submit!');
    }
  },
   // 钩子函数。在渲染页面时获取登录用户信息
   created() {
    // 获取登录 DU用户信息
    this.trapdoor.DuName = window.sessionStorage.getItem("username");
    this.trapdoor.DuEmail = window.sessionStorage.getItem("email");
  },

};
</script>
<style scoped>
.container {
  width: 800px;
  margin: 0 auto;
}
</style>
