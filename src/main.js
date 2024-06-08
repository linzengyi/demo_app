import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { 
  Container, 
  Row, 
  Col, 
  Header, 
  Footer, 
  Aside, 
  Main, 
  Menu,
  MenuItem, 
  Button, 
  MessageBox, 
  Form,
  FormItem,
  Input,
  Divider,
  Descriptions,
  DescriptionsItem,
  Checkbox,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Tooltip,
  Select,
  Option,
  Card,
  Popover
} from 'element-ui';

import App from './App.vue'
import router from './router'

import 'animate.css';
import 'element-ui/lib/theme-chalk/message-box.css';
import './assets/main.css'

Vue.use(PiniaVuePlugin)

Vue.component(Container.name, Container);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Header.name, Header);
Vue.component(Footer.name, Footer);
Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);
Vue.component(Menu.name, Menu);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Button.name, Button);
Vue.component(Divider.name, Divider);
Vue.component(Descriptions.name, Descriptions);
Vue.component(DescriptionsItem.name, DescriptionsItem);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(Pagination.name, Pagination);
Vue.component(Tooltip.name, Tooltip);

Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Card.name, Card);
Vue.component(Popover.name, Popover);


// #MessageBox
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App)
}).$mount('#app')
