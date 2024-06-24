console.log('Script loaded and attached.');

function log(message) {
    console.log(message);
}

// Intercept fopen
Interceptor.attach(Module.findExportByName(null, 'fopen'), {
    onEnter: function (args) {
        var path = Memory.readUtf8String(args[0]);
        var mode = Memory.readUtf8String(args[1]);
        log('fopen called with path: ' + path + ' and mode: ' + mode);
    },
    onLeave: function (retval) {
        log('fopen returned: ' + retval);
    }
});

// Intercept fread
Interceptor.attach(Module.findExportByName(null, 'fread'), {
    onEnter: function (args) {
        log('fread called with ptr: ' + args[0] + ', size: ' + args[1] + ', nmemb: ' + args[2] + ', stream: ' + args[3]);
    },
    onLeave: function (retval) {
        log('fread returned: ' + retval);
    }
});

// Intercept open
Interceptor.attach(Module.findExportByName(null, 'open'), {
    onEnter: function (args) {
        var path = Memory.readUtf8String(args[0]);
        var flags = args[1].toInt32();
        log('open called with path: ' + path + ' and flags: ' + flags);
    },
    onLeave: function (retval) {
        log('open returned: ' + retval);
    }
});

// Intercept read
Interceptor.attach(Module.findExportByName(null, 'read'), {
    onEnter: function (args) {
        log('read called with fd: ' + args[0] + ', buf: ' + args[1] + ', count: ' + args[2]);
    },
    onLeave: function (retval) {
        log('read returned: ' + retval);
    }
});

// Intercept write
Interceptor.attach(Module.findExportByName(null, 'write'), {
    onEnter: function (args) {
        log('write called with fd: ' + args[0] + ', buf: ' + args[1] + ', count: ' + args[2]);
    },
    onLeave: function (retval) {
        log('write returned: ' + retval);
    }
});

// Intercept memory reads
Interceptor.attach(Module.findExportByName(null, 'memcpy'), {
    onEnter: function (args) {
        log('memcpy called with dest: ' + args[0] + ', src: ' + args[1] + ', n: ' + args[2]);
    },
    onLeave: function (retval) {
        log('memcpy returned: ' + retval);
    }
});

// Intercept potential decryption functions
Interceptor.attach(Module.findExportByName(null, 'EVP_DecryptInit_ex'), {
    onEnter: function (args) {
        log('EVP_DecryptInit_ex called with args: ' + args[0] + ', ' + args[1] + ', ' + args[2] + ', ' + args[3] + ', ' + args[4]);
    },
    onLeave: function (retval) {
        log('EVP_DecryptInit_ex returned: ' + retval);
    }
});

Interceptor.attach(Module.findExportByName(null, 'EVP_DecryptUpdate'), {
    onEnter: function (args) {
        log('EVP_DecryptUpdate called with args: ' + args[0] + ', ' + args[1] + ', ' + args[2] + ', ' + args[3] + ', ' + args[4]);
    },
    onLeave: function (retval) {
        log('EVP_DecryptUpdate returned: ' + retval);
    }
});

Interceptor.attach(Module.findExportByName(null, 'EVP_DecryptFinal_ex'), {
    onEnter: function (args) {
        log('EVP_DecryptFinal_ex called with args: ' + args[0] + ', ' + args[1]);
    },
    onLeave: function (retval) {
        log('EVP_DecryptFinal_ex returned: ' + retval);
    }
});

log('Interceptors attached.');
