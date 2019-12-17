// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  //test_policies_get
  'GET /ap1/ListIngroup': [{
    name: 'a',
    description: '',
    interlist: ['X1', 'X2', 'X3'],
    lagid: 1,
    deduplication: 1,
    tuple_mode: 1,
  },{
    name: 'c',
    description: '',
    interlist: ['X12'],
    lagid: 3,
    deduplication: 0,
    tuple_mode: 0,
  },],
  'GET /ap1/ListOutgroup': [{
    name: 'b',
    description: '',
    interlist: ['X2', 'X3', 'X15'],
    lagid: 2,
    load_balance_mode:  "wrr",
    load_balance_weight: "1:10:10"
  },{
    name: 'd',
    description: '',
    interlist: ['X12', 'X13', 'X25'],
    lagid: 4,
    load_balance_mode: "round_robin",
    load_balance_weight: ""
  }],
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /ap/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  //sf3000_test_Userlist
  'GET /ap1/Userlist': [
    {
      key: '1',
      username: 'J',
      name: 'John Brown',
      phone_num: 12345678900,
      department: 'New York No. 1 Lake Park',
      email: '12345678@qq.com',
      depict_ID: 'Null'
    },
    {
      key: '2',
      username: 'J',
      name: 'John Brown',
      phone_num: 12345678900,
      department: 'New York No. 1 Lake Park',
      email: '12345678@qq.com',
      depict_ID: 'Null'
    },
    {
      key: '3',
      username: 'J',
      name: 'John Brown',
      phone_num: 12345678900,
      department: 'New York No. 1 Lake Park',
      email: '12345678@qq.com',
      depict_ID: 'Null'
    },
  ],
  //sf3000_test_Rolelist
  'GET /ap1/RoleList': [
    {
      rolename: '管理员',
      description: '普通管理员'
    },
    {
      rolename: '普通用户',
      description: '普通用户，可以进行业务配置'
    }
  ],
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  //sf3000_test_Userinsert/update/delete
  'POST /ap1/Userinsert': (req, res) => {
    res.send({
      status:'ok',
    })
  },
  'POST /ap1/Userupdate': (req, res) => {
    res.send({
      status:'ok',
    })
  },
  'POST /ap1/Userdelete': (req, res) => {
    res.send({
      status:'ok',
    })
  },
  //sf3000_test_Roleinsert/edit/delete
  'POST /ap1/PermissInsert': (req, res) => {
    res.send({
      status:'ok',
    })
  },
  'POST /ap1/UpdateRole': (req, res) => {
    res.send({
      status:'ok',
    })
  },
  'POST /ap1/Roledelete': (req, res) => {
    res.send({
      status:'ok',
    })
  },
  'GET /ap1/PermissList': 
    [{
        id_p: 1,
        name_p: 'user_read',
        value_p: 1
      },{
        id_p: 2,
        name_p: 'user_write',
        value_p: 1
      },{
        id_p: 3,
        name_p: 'role_read',
        value_p: 1
      },{
        id_p: 4,
        name_p: 'role_write',
        value_p: 1
      }
    ],
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
