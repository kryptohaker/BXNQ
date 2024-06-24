console.log('Script loaded and attached.');

Interceptor.attach(Module.findExportByName(null, 'fopen'), {
    onEnter: function (args) {
        var path = Memory.readUtf8String(args[0]);
        var mode = Memory.readUtf8String(args[1]);
        console.log('fopen called with path: ' + path + ' and mode: ' + mode);
    },
    onLeave: function (retval) {
        console.log('fopen returned: ' + retval);
    }
});

Interceptor.attach(Module.findExportByName(null, 'fread'), {
    onEnter: function (args) {
        console.log('fread called with ptr: ' + args[0] + ', size: ' + args[1] + ', nmemb: ' + args[2] + ', stream: ' + args[3]);
    },
    onLeave: function (retval) {
        console.log('fread returned: ' + retval);
    }
});

Interceptor.attach(Module.findExportByName(null, 'open'), {
    onEnter: function (args) {
        var path = Memory.readUtf8String(args[0]);
        var flags = args[1].toInt32();
        console.log('open called with path: ' + path + ' and flags: ' + flags);
    },
    onLeave: function (retval) {
        console.log('open returned: ' + retval);
    }
});

Interceptor.attach(Module.findExportByName(null, 'read'), {
    onEnter: function (args) {
        console.log('read called with fd: ' + args[0] + ', buf: ' + args[1] + ', count: ' + args[2]);
    },
    onLeave: function (retval) {
        console.log('read returned: ' + retval);
    }
});

Interceptor.attach(Module.findExportByName(null, 'write'), {
    onEnter: function (args) {
        console.log('write called with fd: ' + args[0] + ', buf: ' + args[1] + ', count: ' + args[2]);
    },
    onLeave: function (retval) {
        console.log('write returned: ' + retval);
    }
});

Interceptor.attach(Module.findExportByName(null, 'memcpy'), {
    onEnter: function (args) {
        console.log('memcpy called with dest: ' + args[0] + ', src: ' + args[1] + ', n: ' + args[2]);
        var src = args[1];
        var n = args[2].toInt32();
        var decryptedData = Memory.readByteArray(src, n);
        var hexString = Array.prototype.map.call(new Uint8Array(decryptedData), x => ('00' + x.toString(16)).slice(-2)).join('');
        console.log('Decrypted Data: ' + hexString);
    },
    onLeave: function (retval) {
        console.log('memcpy returned: ' + retval);
    }
});

console.log('Interceptors attached.');
