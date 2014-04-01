module.exports = function(grunt) {

	// Load all tasks
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	// Paths
	var PathConfig = {
		dev: 'dev/',
		dist: 'dist/'
	};

	//Set scripts here for Uglify
	var scripts = [
		'<%= config.dev %>assets/_js/**/*.js'
	]; 

	grunt.initConfig({
		//import package manifest - informations
		pkg: grunt.file.readJSON("package.json"),

		//config path
		config: PathConfig, 

		//JShint
		jshint: {
			files: ['<%= config.dev %>assets/_js/**/*.js']
		},

		//clean files
		clean: {
			dist: {
				src: ["dist/"]
			}
		},

		//copy files
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'dev/',
						src: [
							'**',
							'*.{md,txt,htaccess}',
							'!assets/**/.{png,jpg,gif,jpeg}',
							'!assets/_**/**'
						],
						dest: 'dist/'
					} // makes all src relative to cwd
				]
			}
		}, 

		//concat definitions
		concat: {
			options: {
				stripBanners: true,
				banner: "<%= meta.banner %>"
			},
			js: {
				src: ['<%= config.dev %>assets/js/**/*.js'],
				dest: '<%= config.dist %>assets/js/all.min.js',
			},
			css: {
				src: ['<%= config.dev %>assets/css/**/*.css'],
				dest: '<%= config.dist %>assets/css/all.min.css',
			}
		},

		//banner definitions
		meta: {
			banner: "/*\n" +
			" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
			" *  <%= pkg.description %>\n" +
			" *  <%= pkg.url %>\n" +
			" *\n" +
			" *  Made by <%= pkg.author.name %>\n" +
			" */\n"
		},

		//uglify JS
		uglify: {
			options: {
				mangle: false,
			},
			dist: {
				files: {
					'<%= config.dev %>/assets/js/scripts.min.js': scripts //stay here, because the copy of dist
				}
			},
			dev: {
				options: {
					beautify: true
				},
				files: {
					'<%= config.dev %>/assets/js/scripts.min.js': scripts
				}
			}
		},

		//minify HTML
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.dev %>/',
						src: '*.html',
						dest: '<%= config.dist %>/',
					}
				],
			},
			dev: {
				files: [
					{
						expand: true,
						cwd: '<%= config.dev %>/',
						src: '*.html',
						dest: '<%= config.dev %>/',
					}
				],
			}
		},

		//minify images
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.dev %>/assets/img',
						src: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
						dest: '<%= config.dist %>/assets/img',
					}
				],
			}
		},

		//css lint
		csslint: {
			dev: {
				csslintrc: '.csslintrc'
			},
			strict: {
				src: ['<%= config.dev %>/assets/css/**/*']
			}
		},

		//compile scss
		compass: {
			dist: { 
				options: { 
					force: true,
					config: 'config.rb',
					sassDir: '<%= config.dev %>assets/_sass',
					cssDir: '<%= config.dist %>assets/css',
					outputStyle: 'compressed'
				}
			},
			dev: { 
				options: {
					config: 'config.rb',
					sassDir: '<%= config.dev %>assets/_sass',
					cssDir: '<%= config.dev %>assets/css',
					outputStyle: 'nested',
				}
			}
		},

		//exec commands
		exec: {
			// Generate staging files (not optimized, but after preprocessing)
			// In docpad, static is used for production ready build
			// We use it as a pre-production build (staging), but
			// still environment name for docpad is "static"
			//
			// TODO: replace this with docpad wrapper using docpad API
			//
		},

		//FTP deployment
		'ftp-deploy': {
			build: {
				auth: {
					host: 'ftp.andersonaguiar.com', //your ftp host
					port: 21,
					authKey: 'key1' //.ftppass file on the ./
				},
				src: './dist',
				dest: 'grunt', //your remote directory(grunt was my test)
				exclusions: [
					'./**/.*', //all files what begin with dot
					'./**/Thumbs.db',
					'./**/README.md',
					'./**/*.zip',
					// './**/node_modules',
					// './**/dev'
				]
			}
		},

		// make a zipfile
		compress: {
			all: {
				options: {
					archive: 'dist/all.zip'
				},
				files: [
					{ 
						/*flatten: true,*/ expand: true, cwd: './', src: ['./**'], dest: '' 
					}, // includes files in path
				]
			},
			dist: {
				options: {
					archive: 'dist/dist.zip'
				},
				files: [
					{ 
						/*flatten: true,*/ expand: true, cwd: './', src: ['./dist/**'], dest: '' 
					}, // includes files in path
				]
			},
			dev: {
				options: {
					archive: 'dist/dev.zip'
				},
				files: [
					{ 
						/*flatten: true,*/ expand: true, cwd: './', src: ['./dev/**'], dest: '' 
					}, // includes files in path
				]
			}
		},

		//print screen (for this is necessary install phantomjs: http://phantomjs.org/download.html)
		//if windows, set the path of phantom on Environment Variables
		autoshot: {
			default_options: {
				options: {
					path: './dev/screenshots',
					filename: 'screenshot',
					type: 'jpg',
					//remote: 'http://github.com/',
					local: {
						path: './dev',
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

		//watcher project
		watch: {
			options: {
				debounceDelay: 500
			},
			css: {
				files: ['<%= config.dev %>assets/_sass/**/*'],
				tasks: ['compass:dev', 'csslint:strict']
			},
			js: {
				files: [
					'<%= config.dev %>**/js/*.js',
				],
				tasks: ['uglify:dev','jshint']
			},
			livereload: {
				options: {
					livereload: true
				},
				files: ['<%= config.dev %>assets/css/*.css', '<%= config.dev %>assets/js/scripts.js', '<%= config.dev %>**.html']
			}
		} // watch 

	});

	//dev
	grunt.registerTask('dev', ['compass:dev']);

	//deploy
	grunt.registerTask('deploy', ['ftp-deploy:build']);

	//compress
	grunt.registerTask('zip', ['compress:dist','compress:dev','compress:all']);    

	//build
	grunt.registerTask('dist', ['clean', 'uglify:dist', 'copy:dist', 'concat:js', /*'concat:css',*/ 'compass:dist', 'jshint', 'imagemin:dist', 'htmlmin:dist'/*, 'zip'*/]);

	//watch
	grunt.registerTask('w', ['watch']);

};
