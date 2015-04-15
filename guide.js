// CREATE PLAYER
munch.createPlayer();

// LOAD ANIMATIONS
// ======================================
	// 1ST WAY - Callback Chaining 
		function walk(){
			munch.player.walk = new Animation("football_sprite11.png", 36, 64, sprint);
				munch.player.walk.addFrame(432,0, 36,64); // 0
				munch.player.walk.addFrame(468,0,36,64); // 1
				munch.player.walk.addFrame(504,0,36,64); // 2
				munch.player.walk.setFrameOrder([0,1,2,1]);
				munch.player.walk.divideFpsFrequency(4);
		}

		function sprint() {
			munch.player.sprint = new Animation("football_sprite11.png", 36, 64, startGame);
				munch.player.sprint.addFrame(576,0,36,64); // 0
				munch.player.sprint.addFrame(612,0,36,64); // 1
				munch.player.sprint.addFrame(648,0,36,64); // 2
				munch.player.sprint.addFrame(684,0,36,64); // 3
				munch.player.sprint.setFrameOrder([0,1,2,3]);
				munch.player.sprint.divideFpsFrequency(2);
		}

		walk();
		

	// 2ND WAY - CREATING A PRELOADER (RECOMENDED) 	
	
		munch.myPreloader = new Preloader(function(){    // Instantiate preloader
			startgame();	//run code when all assets in preloader are loaded
		}); 

			// callback to preloader.success
			munch.player.walk = new Animation("football_sprite11.png", 36, 64, munch.myPreloader.success);
				munch.player.walk.preloader(munch.myPreloader);
				munch.player.walk.addFrame(432,0, 36,64); // 0
				munch.player.walk.addFrame(468,0,36,64); // 1
				munch.player.walk.addFrame(504,0,36,64); // 2
				munch.player.walk.setFrameOrder([0,1,2,1]);
				munch.player.walk.divideFpsFrequency(4);

			// callback to preloader.success
			munch.player.sprint = new Animation("football_sprite11.png", 36, 64, munch.myPreloader.success);
				munch.player.sprint.preloader(munch.myPreloader);
				munch.player.sprint.addFrame(576,0,36,64); // 0
				munch.player.sprint.addFrame(612,0,36,64); // 1
				munch.player.sprint.addFrame(648,0,36,64); // 2
				munch.player.sprint.addFrame(684,0,36,64); // 3
				munch.player.sprint.setFrameOrder([0,1,2,3]);
				munch.player.sprint.divideFpsFrequency(2);

		



