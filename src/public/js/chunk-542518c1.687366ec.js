(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-542518c1"],{"0813":function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("h1",[t._v("Reset Password")]),n("bForm",[n("bFormGroup",{attrs:{label:"New Password: ","label-for":"pwd"}},[n("bFormInput",{attrs:{type:"password",id:"pwd",placeholder:"Enter New password",required:""},model:{value:t.pwd,callback:function(e){t.pwd=e},expression:"pwd"}})],1),n("bFormGroup",{attrs:{label:"Confirm New Password: ","label-for":"cpwd"}},[n("bFormInput",{attrs:{type:"password",id:"cpwd",placeholder:"Re enter New password",required:""},on:{keyup:function(e){return t.checkMatch()}},model:{value:t.cpwd,callback:function(e){t.cpwd=e},expression:"cpwd"}})],1),t.nomatch?n("small",{staticClass:"red"},[n("li",[t._v(" Passwords do not match ")])]):t._e(),n("hr"),n("bButton",{on:{click:function(e){return t.changePwd()}}},[t._v("Submit")])],1)],1)},a=[],s={name:"Reset",data:function(){return{pwd:"",cpwd:"",token:this.$route.query.token,nomatch:!1}},created:function(){console.log(window.location.pathname)},methods:{changePwd:function(){var t=this;this.pwd===this.cpwd&&""!=this.pwd?this.$store.dispatch("resetPassword",{token:this.token,pwd:this.pwd}).then((function(e){e&&t.$router.push({name:"Home"})})):(alert("Passwords do not match and cannot be empty"),this.pwd="",this.cpwd="")},checkMatch:function(){this.pwd!=this.cpwd?this.nomatch=!0:this.nomatch=!1}}},c=s,r=(n("3aa5"),n("2877")),d=Object(r["a"])(c,o,a,!1,null,"6b68c25a",null);e["default"]=d.exports},"08ea":function(t,e,n){},"3aa5":function(t,e,n){"use strict";n("08ea")}}]);
//# sourceMappingURL=chunk-542518c1.687366ec.js.map