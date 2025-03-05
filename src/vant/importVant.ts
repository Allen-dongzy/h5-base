import 'vant/lib/index.css'
import type { App } from 'vue'
import {
  ConfigProvider,
  Button,
  Icon,
  Field,
  Tabbar,
  TabbarItem,
  Search,
  Cell,
  CellGroup,
  Card,
  DropdownMenu,
  DropdownItem,
  Popup,
  Tab,
  Tabs,
  List,
  Collapse,
  CollapseItem,
  Image,
  Dialog,
  Toast,
  Checkbox,
  CheckboxGroup,
  Uploader,
  Picker,
  Grid,
  GridItem,
  SwipeCell,
  Stepper,
  Lazyload,
  ActionSheet,
  Radio,
  ImagePreview,
  RadioGroup,
  Loading,
  PullRefresh,
  Calendar,
  Divider
} from 'vant'

const importVant = (app: App<Element>) => {
  app.use(ConfigProvider)
  app.use(Button)
  app.use(Icon)
  app.use(Field)
  app.use(Tabbar)
  app.use(TabbarItem)
  app.use(Search)
  app.use(Cell)
  app.use(CellGroup)
  app.use(Card)
  app.use(DropdownMenu)
  app.use(DropdownItem)
  app.use(Popup)
  app.use(Tab)
  app.use(Tabs)
  app.use(List)
  app.use(Collapse)
  app.use(CollapseItem)
  app.use(Dialog)
  app.use(Toast)
  app.use(Image)
  app.use(Checkbox)
  app.use(CheckboxGroup)
  app.use(Uploader)
  app.use(Picker)
  app.use(Grid)
  app.use(GridItem)
  app.use(SwipeCell)
  app.use(Stepper)
  app.use(Lazyload)
  app.use(ActionSheet)
  app.use(Radio)
  app.use(RadioGroup)
  app.use(ImagePreview)
  app.use(Loading)
  app.use(PullRefresh)
  app.use(Calendar)
  app.use(Icon)
  app.use(Divider)
}

export default importVant
