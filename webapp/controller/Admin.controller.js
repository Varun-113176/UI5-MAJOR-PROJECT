sap.ui.define([
"sap/ui/core/mvc/Controller",
"sap/m/Dialog",
"sap/m/VBox",
"sap/m/Input",
"sap/m/CheckBox",
"sap/m/Button",
"sap/m/MessageBox",
"sap/m/MessageToast"
], function (
Controller,
Dialog,
VBox,
Input,
CheckBox,
Button,
MessageBox,
MessageToast
) {

"use strict";

return Controller.extend("com.varun.project1.fioriproject.controller.Admin", {

onInit: function () {

var oRouter = this.getOwnerComponent().getRouter();
oRouter.getRoute("Admin").attachPatternMatched(this._clearFields, this);

console.log("Admin Controller Loaded");

if (oRouter) {
console.log("Router Initialized");
} else {
console.log("Router NOT Initialized");
}

},

_clearFields: function () {

var oEmail = this.byId("emailInput") || this.byId("emailInput1");
var oPassword = this.byId("passwordInput") || this.byId("passwordInput1");

if (oEmail) { oEmail.setValue(""); }
if (oPassword) { oPassword.setValue(""); }

},

onShowPassword: function (oEvent) {

var oPassword = this.byId("passwordInput") || this.byId("passwordInput1");

if (oPassword) {
oPassword.setType(oEvent.getParameter("selected") ? "Text" : "Password");
}

},

_navigateToEmployee: function (sEmail) {

var oRouter = this.getOwnerComponent().getRouter();

if (!oRouter) {
MessageBox.error("Router not initialized");
return;
}

console.log("Navigating to Employee with:", sEmail);

oRouter.navTo("Employee", {
empName: sEmail,
role: "Admin"
});

},

onLogin: function () {

var oEmail = this.byId("emailInput") || this.byId("emailInput1");
var oPassword = this.byId("passwordInput") || this.byId("passwordInput1");

if (!oEmail || !oPassword) {
MessageBox.error("Input fields not found");
return;
}

var sEmail = oEmail.getValue();
var sPassword = oPassword.getValue();

var aHRUsers = JSON.parse(localStorage.getItem("HRUsers")) || [];

var oHRUser = aHRUsers.find(function (u) {
return u.email === sEmail;
});

if (oHRUser) {
MessageBox.error("Already registered as HR. You are in wrong page.");
return;
}

var aUsers = JSON.parse(localStorage.getItem("AdminUsers")) || [];

var oUser = aUsers.find(function (u) {
return u.email === sEmail;
});

if (!oUser) {
MessageBox.error("Email does not exist. Please signup first.");
return;
}

if (oUser.password !== sPassword) {
MessageBox.error("Incorrect password");
return;
}

MessageToast.show("Admin Login Successful");

this._navigateToEmployee(sEmail);

},

onOpenSignup: function () {

if (!this._oSignupDialog) {
this._oSignupDialog = this._createSignupDialog();
}

this._oSignupDialog.open();

},

_createSignupDialog: function () {

var oFirst = new Input({placeholder:"First Name"});
var oLast = new Input({placeholder:"Last Name",class:"sapUiSmallMarginTop"});
var oEmail = new Input({placeholder:"Admin Email",type:"Email",class:"sapUiSmallMarginTop"});
var oPass = new Input({placeholder:"Password",type:"Password",class:"sapUiSmallMarginTop"});
var oConfirm = new Input({placeholder:"Confirm Password",type:"Password",class:"sapUiSmallMarginTop"});

var oDialog = new Dialog({

title:"Admin Register",
contentWidth:"380px",

content:new VBox({
class:"sapUiMediumMargin",
items:[
oFirst,
oLast,
oEmail,
oPass,
oConfirm,
new CheckBox({text:"I Agree to Terms & Conditions"})
]
}),

beginButton:new Button({

text:"Register",
type:"Emphasized",

press:function(){

var email=oEmail.getValue();
var password=oPass.getValue();

var aHRUsers = JSON.parse(localStorage.getItem("HRUsers")) || [];

if(aHRUsers.some(function(u){return u.email===email;})){
MessageBox.error("Already registered in HR. You are in wrong page.");
return;
}

var emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){
MessageBox.error("Enter valid email format");
return;
}

var passRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if(!passRegex.test(password)){
MessageBox.error("Password must contain required format");
return;
}

if(password!==oConfirm.getValue()){
MessageBox.error("Passwords do not match");
return;
}

var aUsers=JSON.parse(localStorage.getItem("AdminUsers"))||[];

if(aUsers.some(function(u){return u.email===email;})){
MessageBox.error("Admin already registered");
return;
}

aUsers.push({
firstname:oFirst.getValue(),
lastname:oLast.getValue(),
email:email,
password:password
});

localStorage.setItem("AdminUsers",JSON.stringify(aUsers));

MessageBox.success("Admin Signup Successful");

oDialog.close();

}

}),

endButton:new Button({
text:"Close",
press:function(){oDialog.close();}
})

});

return oDialog;

},

onForgotPassword:function(){

if(!this._oForgotDialog){
this._oForgotDialog=this._createForgotDialog();
}

this._oForgotDialog.open();

},

_createForgotDialog:function(){

var oEmail=new Input({placeholder:"Admin Email",type:"Email"});
var oNewPass=new Input({placeholder:"New Password",type:"Password",class:"sapUiSmallMarginTop"});
var oRePass=new Input({placeholder:"Re-enter Password",type:"Password",class:"sapUiSmallMarginTop"});

var oDialog=new Dialog({

title:"Reset Password",

content:new VBox({
class:"sapUiMediumMargin",
items:[oEmail,oNewPass,oRePass]
}),

beginButton:new Button({

text:"Submit",
type:"Emphasized",

press:function(){

var email=oEmail.getValue();
var newPass=oNewPass.getValue();
var rePass=oRePass.getValue();

if(newPass!==rePass){
MessageBox.error("Passwords do not match");
return;
}

var aUsers=JSON.parse(localStorage.getItem("AdminUsers"))||[];

var oUser=aUsers.find(function(u){return u.email===email;});

if(!oUser){
MessageBox.error("Email not found");
return;
}

oUser.password=newPass;

localStorage.setItem("AdminUsers",JSON.stringify(aUsers));

MessageBox.success("Password Reset Successful");

oDialog.close();

}

}),

endButton:new Button({
text:"Cancel",
press:function(){oDialog.close();}
})

});

return oDialog;

}

});
});


