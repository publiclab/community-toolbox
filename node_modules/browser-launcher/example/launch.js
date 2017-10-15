var launcher = require('../');
launcher(function (err, launch) {
    if (err) return console.error(err);
    
    console.log('# available browsers:');
    console.dir(launch.browsers);
    
    var opts = {
        browser : 'chrome',
        //options:['--remote-debugging-port=9222','--disable-hang-monitor'],
        //headless : true,
        //proxy : 'localhost:7077',
    };
    launch('http://substack.net', opts, function (err, ps) {
        if (err) return console.error(err);
        ps.on('exit', console.log);
    });
});
