import Vue from 'vue'
import { 
    Button, 
    Form, 
    FormItem, 
    Input, 
    Message, 
    Radio,
    Checkbox,
    Select,
    DatePicker,
    TimePicker,
    Switch,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Option,
    Upload,
    MessageBox,
    Loading,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Badge,
    Link,
    Collapse,
    CollapseItem,
    Divider,
    Tag,
} from "element-ui"
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Switch)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Option)
Vue.use(Upload)
Vue.use(Loading.directive)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Badge)
Vue.use(Link)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Divider)
Vue.use(Tag)
// 消息框是加在VUe实例上与上面不同
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox
