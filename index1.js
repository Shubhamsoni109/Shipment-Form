/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var shptDbName = "SHIPMENT Table";
var shptRelationName = "SHIPMENT-DB";
var connToken = "90932477|-31949270387008553|90955470";
/*$("$shptNo").focus();*/
function saveRecNo2LS(jsonObj){
    var shptData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno",shptData.rec_no); 
}
function getShptNoAsJsonObj(){
    var ShptId = $("#ShptId").val();
    var jsonStr = {
        id:ShptId
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#ShptId").val(record.ShptId);
    $("#shptDescription").val(record.shptDescription);
    $("#from").val(record.from);
    $("#to").val(record.to);
    $("shippingDate").val(record.shippingDate);
    $("#EDD").val(record.EDD);
}

function resetForm(){
    $("#ShptId").val(" ");
    $("#shptDescription").val(" ");
    $("#from").val(" ");
    $("#to").val(" ");
    $("#shippingDate").val(" ");
    $("#EDD").val(" ");
    $("#ShptId").prop("disabled",false);
    $("#Save").prop("disabled",true);
    $("#Change").prop("disabled",true);
    $("#Reset").prop("disabled",true);
    $("#ShptId").focus();
}

function validateData(){
    var shptId, shptDescription, from, to, shippingDate, EDD;
    shptId=$("#ShptId").val();
    shptDescription=$("#shptDescription").val();
    from=$("#from").val();
    to=$("#to").val();
    shippingDate=$("#shippingDate").val();
    EDD=$("#EDD").val();
    
    if (ShptId=== " "){
        alert("Shipment ID missing");
        $("#shptNo").focus();
        return " ";
    }
    if (shptDescription=== " "){
        alert("Shipment Description is missing");
        $("#shptDescription").focus();
        return " ";
    }
    if (from=== " "){
        alert("Source is missing");
        $("#from").focus();
        return " ";
    }
    if (to=== " "){
        alert("Destination is missing");
        $("#to").focus();
        return " ";
    }
    if (shippingDate=== " "){
        alert("Shipping Date missing");
        $("#shippingDate").focus();
        return " ";
    }
    if (EDD=== " "){
        alert("Estimated Date of Arrival is missing");
        $("#EDD").focus();
        return " ";
    }
    
    var jsonStrObj = {
        Shpt_No: ShptId ,
        Shpt_Desc: shptDescription,
        From: from ,
        To: to,
        Shpt_Date: shippingDate,
        Expected_Dt: EDD
    };
    return JSON.stringify(jsonStrObj);
}

function getShptNo(){
    var ShptIdJsonObj = getShptNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,shptDbName, shptRelationName, ShptIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if (resJsonObj.status===400){
        $("#Save").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#ShptId").focus();
    } 
    else if (resJsonObj.status=== 200){
        $("#ShptId").prop("disabled", true);
        fillData(resJsonObj);
        $("#Change").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#shptDescription").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, shptDbName, shptRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $("#ShptId").focus();
}
function changeData(){
    $("#Change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest=createUPDATERecordRequest(connToken, jsonChg, shptDbName, shptRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#ShptId").focus();
    
}