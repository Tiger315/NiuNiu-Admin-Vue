var apiPath = "http://sign.niuniu.com:8814/api/v1/";
var attPath = "http://sign.niuniu.com:8814/api/v1/att/";

function getData(cName, isAsync, sCallback, eCallback) {
    var url = apiPath + cName;
    $.ajax({
        async: isAsync,
        url: url,
        dataType: "json",
        type: 'GET',
        success: function (res) {
            sCallback(res);
        },
        error: function (a, b, c) {
            eCallback(a, b, c);
        }
    });
}

function postData(cName, pData, sCallback, eCallback) {
    var url = apiPath + cName;
    $.ajax({
        url: url,
        dataType: "json",
        type: "POST",
        data: pData,
        success: function (res) {
            sCallback(res);
        },
        error: function (a, b, c) {
            eCallback(a, b, c);
        }
    });
}

function updateData(cName, pData, sCallback, eCallback) {
    var url = apiPath + cName;
    $.ajax({
        url: url,
        dataType: "json",
        type: "PUT",
        data: pData,
        success: function (res) {
            sCallback(res);
        },
        error: function (a, b, c) {
            eCallback(a, b, c);
        }
    });
}

function deleteData(cName, sCallback, eCallback) {
    var url = apiPath + cName;
    $.ajax({
        url: url,
        dataType: "json",
        type: "DELETE",
        success: function (res) {
            sCallback(res);
        },
        error: function (a, b, c) {
            eCallback(a, b, c);
        }
    });
}

function getParameter(paraStr) {
    var url = location.search;
    var result = "";
    //获取URL中全部参数列表数据

    var str = "&" + url.split("?")[1];
    var paraName = paraStr + "=";
    //判断要获取的参数是否存在

    if (str.indexOf("&" + paraName) != -1) {
        //如果要获取的参数到结尾是否还包含“&”

        if (str.substring(str.indexOf(paraName), str.length).indexOf("&") != -1) {
            //得到要获取的参数到结尾的字符串
            var TmpStr = str.substring(str.indexOf(paraName), str.length);

            //截取从参数开始到最近的“&”出现位置间的字符
            result = TmpStr.substr(TmpStr.indexOf(paraName), TmpStr.indexOf("&") - TmpStr.indexOf(paraName));
        } else {
            result = str.substring(str.indexOf(paraName), str.length);
        }
    } else {
        result = "无此参数";
    }
    return (result.replace("&", "").replace(paraName, ""));
}