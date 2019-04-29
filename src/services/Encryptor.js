import CryptoJS from 'crypto-js';

export default {
    test (str) {
        console.log(str);
    },
    hex2bin (hex) {
        var bytes = [];
        var str;
        for (var i = 0; i < hex.length - 1; i += 2) {
            bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        str = String.fromCharCode.apply(String, bytes);

        return str;
    },
    bin2hex (s) {
        var i, l, o = '', n;
        s += '';
        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i).toString(16);
            o += n.length < 2 ? '0' + n : n;
        }

        return o;
    },
    encryptStr (str, iv) {
        var key = CryptoJS.enc.Hex.parse(process.env.APP_API_KEY);
        iv = CryptoJS.lib.WordArray.random(16);
        let encrypted = CryptoJS.AES.encrypt(str, key, {
            iv: iv
        });

        return btoa(this.hex2bin(iv.toString())) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    },
    decryptStr: function (str) {
        let strTab = atob(str).split(':');
        let iv = CryptoJS.enc.Hex.parse(this.bin2hex(atob(strTab[0])));
        let encryptedStr = strTab[1];
        let key = CryptoJS.enc.Hex.parse(process.env.APP_API_KEY);
        let decryptedStr = CryptoJS.AES.decrypt(encryptedStr.toString(), key, {iv: iv});
        
        return decryptedStr.toString(CryptoJS.enc.Utf8);
    }
};
