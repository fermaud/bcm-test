'use strict';
var atob = require('atob');
var CryptoJS = require('crypto-js');
const VAR_ENV = require('../config.js');

module.exports = {
    bin2hex: function (s) {
        var i, l, o = '', n;
        s += '';
        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i).toString(16);
            o += n.length < 2 ? '0' + n : n;
        }
        
        return o;
    },
    decryptStr: function (str) {
        let strTab = atob(str).split(':');
        let iv = CryptoJS.enc.Hex.parse(this.bin2hex(atob(strTab[0])));
        let encryptedStr = strTab[1];
        let key = CryptoJS.enc.Hex.parse(VAR_ENV.APP_API_KEY);
        let decryptedStr = CryptoJS.AES.decrypt(encryptedStr.toString(), key, {iv: iv});
        return decryptedStr.toString(CryptoJS.enc.Utf8);
    }
};
