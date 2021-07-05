##基本数据结构 <span id="lc"></span>  
* 审批的条件路径配置 称作 **[流程](#lc)**。当有人发起审批时 把流程处理为具体的 **[过程](#gc)**  
##流程  
* 流程数据结构  
    
    ```javascript  

    {
        type: '', //节点类型 supervisor,主管 branch,分支 role,角色 person,指定人员 copy,抄送人 null,表示流程结束 
        type_remark:{}, //节点信息
        approve_and: false, //不为合签 合签：角色下所有成员都审批后，才算完成该节点
        children:{}, //子节点信息
    }  
    ```
* 主管审批节点
    ```javascript  

    {
        type: 'supervisor', //主管节点
        type_remark: 1, // 第 1 级主管审批，可以取 2,3,4 （越界报错还没写
        children:{

        }, //子节点信息
    }  
    ```
* 分支节点
    ```javascript  

    {
        type: 'branch', //分支节点
        type_remark: {
            //进入分支 '1' 的条件数组
            '1':[
                [ data, '<' , 3 ], //只有一个判断条件： 当 data < 3 时，进入分支 '1'
            ],
            
            '2': [], //若没有进入分支 '1' 则无条件进入分支 '2'

        }, // 分支条件
        children:{
            '1':{

            },
            '2':{

            }
        }, //子节点信息 分支名字不一定要 '1','2' 只要能对应就行了
    }  
    ```
* 角色审批节点  
    ```javascript  
    
    {
       type: 'role', //角色节点
       type_remark: '13', //由 role_id 为 13 的角色来审批
       approve_and: false, //不为合签 合签：角色下所有成员都审批后，才算完成该节点
       children:{

       }, //子节点信息
    }  
    ```
* 指定人员审批节点  
    ```javascript  

    {
        type: 'person', //指定人员节点
        type_remark: ['23','60'], //由 admin_id 为 23 和 60 的人员来审批
        approve_and: false, //不为合签 合签：角色下所有成员都审批后，才算完成该节点
        children:{

        }, //子节点信息
    }  
    ```
* 抄送节点  
    ```javascript  

    {
        type: 'person', //抄送节点
        type_remark: ['23','60'], //抄送给 admin_id 为 23 和 60 的人员
        children:{

        }, //子节点信息
    }  
    ```
* 结束节点  
    ```javascript  

    {
        type: null, //流程到该节点就结束
    }  
    ```
<span id="gc"></span>
* 改进方向
    ```javascript

    目前流程定位人员都是使用 admin_id ， 可以添加一个参数 选择使用 admin_id 或者 open_id
    //但我觉得应该把 admin_id 和 open_id 合并成一个 id

    或者可以把 children 嵌套模式 改成数组模式
    ```
##过程   
* 过程数据结构<span id="course"></span>  

    ```javascript  

    //审批过程 的对象  
    function process_object() {  
        return {  
            node_type: '', //节点类型 supervisor,主管 branch,分支 role,角色 person,指定人员 copy,抄送人 sponsor,发起人  
            node_name: '', //节点名字 显示在流程行左边 如发起人，直接主管  
            node_show: false, //是否展示节点  
            node_id: '', //节点id 字符串 用于数据库查询时判断由谁审批  
            node_complete: true, // 节点业务是否已结束  
            approvers: [], //该节点人员信息列表  
            approve_and: false, //是否是合签  
            approver_pass: [], //审批过的人员列表 对象数组 对象内除人员信息外，'remark' 字段为审批备注, 'status'字段 1 为通过 2为拒绝  'time'为审批时间  
            approver_msg: [], //自定义展示在审批列表的信息,一般在各自页面提交数据时写入  
            approver_title: [], //自定义展示在审批列表的标题,一般在各自页面提交数据时写入  
        };  
    }  
    ```  
##流程组件使用   
* 流程实现化基于 vue 组件  
* 需引入  
    ```javascript

    <link rel="stylesheet" href="__PUBLIC__/process/process.css?v=1.1">
    <script src="__PUBLIC__/process/process.js?v=1.1"></script>
    <script src="...layer.js">
    //可通过修改 ?v=xxx 来更新微信缓存  
    ```
####发起审批的组件  
* 一般形式    
    ```javascript  
    
    //vue组件
    components: {
        //调用 submit_process 函数，传入参数 。函数返回 vue 的组件对象  
        process: submit_process({
            user_info: {}, //传入个人信息 (一般只有open_id
            process_ori_need_data: {
                admin_id_arr: [],
                role_id_arr: [],
                open_id_arr: []
            }, //该流程所需的人员信息
            props: [], //需要传入变量时，传入props
            watch: {}, //vue监听 可以监听值变化触发更改
            mounted: function(){},
            //计算属性存流程json
            computed: {
                process_ori: function () {
                    return {};
                } //返回流程json  ！流程json写在这
            },
        }) //submit_process()
    } //components
    ```
* user_info 发起审批的人员信息 <span id="user_info"></span>   
  [初始化](#mounted)时，通过 user_info传入的 id 获取发起审批的人的信息
    ```javascript

    process: submit_process({
        
        user_info: {
            open_id : ''
        }, //传入个人信息
        
    }) //submit_process()
    ```
* process_ori_need_data 审批流程所需的人员信息  <span id="process_ori_need_data"></span>
  [初始化](#mounted)时，会获取流程所需角色数据  
  **流程中要是使用了未获取的数据，会报错** *(什么时候改进呀)*  
    ```javascript

    process_ori_need_data: {
        admin_id_arr: ['60', '24'], // 获取 admin_id 为 60、24 的成员信息
        role_id_arr: ['13'], //获取 role_id 为 13 的所有角色成员信息
        open_id_arr: []
    },
    ```
*  props 与 watch 与 流程配置<span id="props"></span> <span id="watch"></span>  
   当有流程需要监听 **表单值的变化** 时使用  
   >1.在 props 中申明要传入的变量  
   >2.在 watch 中监听该变量，并调用 this.process_init()刷新流程  
   >3.将表单变量传给组件  
   >4.流程配置使用变量  

    例：
   ```javascript

    //实例化组件部分
    process: submit_process({
        ...
        props: ['date'], //传入变量 date
        watch: {
            //监听 date 变化
            date: function (newDate, oldDate) {
                this.process_init();  //刷新流程函数
                if (!!newDate) {
                    this.is_show_process = true; //显示过程
                } else {
                    this.is_show_process = false; //关闭过程显示，并提示需要填写信息
                }
            }
        },
        ...
    })
    ```
    props组件传值 [详见vue手册](https://cn.vuejs.org/v2/guide/components.html#通过-Prop-向子组件传递数据) <span id="vm_ref"></span>
    ```html

    //将 date 变量传给组件 
    <process ref="process"  
             :date="vm_date">
    </process>
    <script>
        var vm = new Vue({
            ...
            data:{
                vm_date: '1',
            },
            ...
        })

        //设置了ref属性，就可以通过 vm.$refs.process 访问组件对象
        vm.vm_date = '2';
        console.log(vm.$refs.process.date);
    </script>
    ```
    ```javascript

    //在流程中使用变量
    process: submit_process({
        ...
        computed: {
            process_ori: function () {
                var date = this.date;
                //返回流程json  
                return {
                    type: 'branch',
                    type_remark: {
                        '1': [
                            [date, '<', 3], //使用变量
                        ],
                        ...
                    },
                    children: {
                        '1': {
                            ...
                        },
                        ...
                    }
                };
            }
        }
        ...
    }) 
    ```
* mounted 流程初始化函数  <span id="mounted"></span>  
  可以 **自定义组件的内置变量** 来实现不同业务的功能  
  详见[变量定义](#argument)  
    ```javascript
    //默认的初始化函数
    mounted: function(){
        var init = this.process_init;
        Promise.all([
            this.get_need_data(),       //获取流程需要的信息 
            this.get_supervisor_tree(), //获取主管树 通过 user_info 配置的 id 获取
            this.get_user_info()        //获取发起人的个人信息 通过 user_info 配置的 id 获取
        ]).then(init);//全部信息获取完后 ，刷新流程
        this.check_show = true; //打开部门选择
    },
    ```

* 变量定义  <span id="argument"></span>  
  访问方式见[组件传值](#vm_ref)
    
    ```javascript
    //变量
    supervisor_tree:[], //主管树
    /* 主管树数据结构
    [{  
        //发起人所在的 第一个部门的数据
        deparment_id: '',
        ...
        father_deparment:{
            //父部门信息
        }
    },{
        //发起人所在的 第二个部门的数据
    }]
    */

    user_info: {}, //个人信息
    process: [], //实例过程 
    process_ori_need_data：{},//流程所需数据 作为参数传进来，可在初始化时调用方法获取
    process_ori_data_cache: {}, //流程数据缓存 将获取到的流程所需数据，保存在这
    address: {}, //流程实例化时的指针
    is_show_process: false, //默认false，false时提示需要填写必要信息，true时显示过程
    check_show: false, // 默认false，false时不显示部门选择
    check_dep: {}, // 当前选中的部门数据 ！该部门数据为主管树结构！带father_deparment 
    check_dep_id: '', //部门选择的弹窗id，用来关闭弹窗用
    default_avatar: '', // 默认头像
    show_process: true, //true时显示过程。false时不显示过程，也不提示需要必填信息

    //方法
    process_init()  //流程转化为过程

    //流程节点方法
    add_sponsor() //添加发起人节点
    branch_parsing() //处理条件节点
    supervisor_parsing() //处理主管节点
    role_parsing() //处理角色节点
    person_parsing() //处理指定人员节点
    copy_parsing() //处理抄送节点

    
    get_need_data() //获取本流程需要的角色及个人信息
    get_supervisor_tree() //获取主管树
    get_user_info() //获取发起人个人信息
    select_dep() //选择部门 弹窗
    checked_dep() //选择部门 选定
    node_is_fail() //判断节点是否被拒绝 用来显示红色
    getProcess() //返回流程实例
    ```
###审批流程处理   
