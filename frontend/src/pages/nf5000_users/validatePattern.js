export var RegexPattern = {
    //user
    pat_username: /^[a-zA-Z0-9_]+$/,
    pat_password: /^[a-zA-Z0-9_]+$/,
    pat_fullname: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
    pat_department: /^[a-zA-Z\u4e00-\u9fa50-9_]+$/,
    pat_phonenum: /^[0-9-+]+$/,
    pat_email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/,

    //role
    pat_rolename: /^[a-zA-Z0-9_]+$/,
    pat_rolename_number: /^[0-9]+$/
}