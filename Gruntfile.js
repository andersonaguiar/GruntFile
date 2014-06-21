module.exports = function(grunt) {

	'use strict';

	// time of tasks
	require('time-grunt')(grunt);
	
	// Load all tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		// import package manifest - informations
		pkg: grunt.file.readJSON('package.json'),

		// config
		config: {
			paths: {
				assets: 	'assets/',
	            sass:   	'sass/',
	            css:    	'css/',
	            js:     	'js/',
	            img:   		'img/',
	            fonts:  	'fonts/',
		        ftp: 		'www',
	            env: {
	                dev: 	'app/',
	                dist: 	'dist/'
	            }
			},
			meta: {
				banner: '/*\n' +
				' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
				' *  <%= pkg.description %>\n' +
				' *  <%= pkg.url %>\n' +
				' *\n' +
				' *  Made by <%= pkg.author.name %>\n' +
				' */\n'
			}
        },

        // ## TASKS ##
		// clean files
		clean: {
			dist: {
				src: ['<%= config.paths.env.dist %>']
			}
		},

		// copy files
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= config.paths.env.dev %>',
						src: [
							'**',
							'*.{md,txt,htaccess}',
							'!<%= config.paths.assets %>**/.{png,jpg,gif,jpeg}',
							'!<%= config.paths.assets %>_**/**'
						],
						dest: '<%= config.paths.env.dist %>'
					}
				]
			}
		}, 

		// concat definitions
		concat: {
			options: {
				stripBanners: true,
				banner: '<%= config.meta.banner %>'
			},
			js: {
				src: ['<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.js %>**/*.js'],
				dest: '<%= config.paths.env.dist %><%= config.paths.assets %><%= config.paths.js %>all.min.js',
			},
			css: {
				src: ['<%= config.paths.env.dist %><%= config.paths.assets %><%= config.paths.css %>**/*.css'],
				dest: '<%= config.paths.env.dist %><%= config.paths.assets %><%= config.paths.css %>all.min.css',
			}
		},


		// uglify JS
		// uglify: {
		// 	options: {
		// 		mangle: false,
		// 	},
		// 	dist: {
		// 		files: {
		// 			'<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.js %>scripts.min.js': scripts // stay here, because the copy of dist
		// 		}
		// 	},
		// 	dev: {
		// 		options: {
		// 			beautify: true
		// 		},
		// 		files: {
		// 			'<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.js %>scripts.min.js': scripts
		// 		}
		// 	}
		// },

		// minify images
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.img %>',
						src: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
						dest: '<%= config.paths.env.dist %><%= config.paths.assets %><%= config.paths.img %>',
					}
				],
			}
		},

		// css lint
		csslint: {
			dev: {
				csslintrc: '.csslintrc'
			},
			strict: {
				src: ['<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.css %>**/*']
			}
		},

		// compile scss
		compass: {
			dist: { 
				options: { 
					force: true,
					config: 'config.rb',
					sassDir: '<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.sass %>',
					cssDir: '<%= config.paths.env.dist %><%= config.paths.assets %><%= config.paths.css %>',
					outputStyle: 'compressed'
				}
			},
			dev: { 
				options: {
					config: 'config.rb',
					sassDir: '<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.sass %>',
					cssDir: '<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.css %>',
					outputStyle: 'nested',
				}
			}
		},

		// exec commands
		exec: {
		    cmd: 'npm install && bower install && grunt'
		},

		// FTP deployment
		'ftp-deploy': {
			build: {
				auth: {
					host: 'ftp.xxx.xxx', // your ftp host
					port: 21,
					authKey: 'key1' //.ftppass file on the ./
				},
				src: '<%= config.paths.env.dev %>',
				dest: '<%= config.paths.ftp %>', // your remote directory
				exclusions: [
					'./**/.*', // all files what begin with dot
					'./**/Thumbs.db',
					'./**/README.md',
					'./**/*.zip'
				]
			}
		},

		// make a zipfile
		compress: {
			all: {
				options: {
					archive: '<%= config.paths.env.dist %>all.zip'
				},
				files: [
					{ 
						expand: true, cwd: './', src: ['./**'], dest: '' 
					},
				]
			},
			dist: {
				options: {
					archive: '<%= config.paths.env.dist %>dist.zip'
				},
				files: [
					{ 
						expand: true, cwd: './', src: ['<%= config.paths.env.dist %>**'], dest: '' 
					},
				]
			},
			dev: {
				options: {
					archive: '<%= config.paths.env.dist %>dev.zip'
				},
				files: [
					{ 
						expand: true, cwd: './', src: ['<%= config.paths.env.dev %>**'], dest: '' 
					},
				]
			}
		},

		// print screen (for this is necessary install phantomjs: http:// phantomjs.org/download.html)
		// if windows, set the path of phantom on Environment Variables
		autoshot: {
			default_options: {
				options: {
					path: '<%= config.paths.env.dev %>screenshots',
					filename: 'screenshot',
					type: 'jpg',
					// remote: 'http://github.com/',
					local: {
						path: '<%= config.paths.env.dev %>',
						port: 7788
					},
					viewport: [
						'1920x1080',
						'1280x1024',
						'1024x768',
						'768x960',
						'480x600',
						'320x500'
					]
				},
			},
		},

		//concurrent tasks
		concurrent: {
	        dev: [],
	        // target2: ['jshint', 'mocha']
	    },

		// Keep multiple browsers & devices in sync when building websites.
		browserSync: {
		    dev: {
		        bsFiles: {
		            src : [
		            	'<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.css %>**/*.css',
		            	'<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.js %>**/*.js',
		            	'<%= config.paths.env.dev %>**/*.html'
		            ]
		        },
		        options: {
                    watchTask: true,
					server: {
						baseDir: "app/"
					},
					// proxy: {
					// 	host: "192.168.0.11",
					// 	port: 8000
					// }
                }
		    }
		},

		// watcher project
		watch: {
			options: {
				// debounceDelay: 500
			},
			sass: {
				files: ['<%= config.paths.env.dev %><%= config.paths.assets %><%= config.paths.sass %>**/*'],
				tasks: ['compass:dev', 'csslint:strict']
			},
			js: {
				files: [
					'<%= config.paths.env.dev %><%= config.paths.js %>**/*.js',
				],
				tasks: ['uglify:dev','jshint']
			}
		}
	});


	// watch
	grunt.registerTask('default', ['browserSync', 'watch']);

	// build
	grunt.registerTask('dist', ['clean', 'uglify:dist', 'copy:dist', 'concat:js', /*'concat:css',*/ 'compass:dist', 'jshint', 'imagemin:dist', 'htmlmin:dist'/*, 'zip'*/]);
	
	// deploy
	grunt.registerTask('deploy', ['ftp-deploy:build']);

	// compress
	grunt.registerTask('zip', ['compress:dist','compress:dev','compress:all']);    
};
