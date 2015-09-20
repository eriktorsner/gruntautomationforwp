module.exports = function(grunt) {
	var shell = require('shelljs');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	
	grunt.registerTask('default', 'Log some stuff.', function() {
		ls = getLocalsettings();
		grunt.log.write('localsettings successfully read URL=' + ls.url).ok();
	});

	/*
	* Installing WP
	*/
	grunt.registerTask('wp-install', '', function() {
		ls = getLocalsettings();
		wpcmd = 'wp --path=' + ls.wppath + ' --allow-root ';

		shell.mkdir('-p', ls.wppath);

		if(!shell.test('-e', ls.wppath + '/wp-config.php')) {
			shell.exec(wpcmd + 'core download --force');
			shell.exec(wpcmd + 'core config --dbname=' + ls.dbname + ' --dbuser=' + ls.dbuser + ' --dbpass=' + ls.dbpass + ' --quiet');
			shell.exec(wpcmd + 'core install --url=' + ls.url + ' --title="WordPress App" --admin_name=' + ls.wpuser + ' --admin_email="admin@local.dev" --admin_password="' + ls.wppass + '"');
		} else {
			grunt.log.write('Wordpress is already installed').ok();
		}
	});

	/*
	* Setting up WP
	* 
	*/
	grunt.registerTask('wp-setup', '', function() {
		ls = getLocalsettings();
		wpcmd = 'wp --path=' + ls.wppath + ' --allow-root ';
		
		// some standard plugins
		stdplugins = ['if-menu', 'baw-login-logout-menu','google-analyticator'];
		for(i=0;i<stdplugins.length;i++) {
			name = stdplugins[i];		
			shell.exec(wpcmd + 'plugin install --activate ' + name);
		}
		
		//shell.exec(wpcmd + 'option update blogname "Another title"');
		//shell.exec(wpcmd + 'option update blogdescription "experimental tagline"');

	})


	function getLocalsettings(test) {
		ls = grunt.file.readJSON('localsettings.json');
		if(ls.wppath === undefined) ls.wppath = shell.pwd() + '/www/wordpress-default';
		return ls;
	}
};
