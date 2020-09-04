window.Game = window.classes.Game =
class Game extends Simulation
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.identity().times(Mat4.translation([ -2,0,-2]));
		this.battle = Mat4.inverse( context.globals.graphics_state.camera_transform ).times(Mat4.translation([0,0,-4.8]));

      

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const tiles = { 
                         tile_nw: new Tile(0,0,0,0), // no wall
                         tile_lo: new Tile(1,0,0,0), // left only
                         tile_ro: new Tile(0,1,0,0), // right only
                         tile_do: new Tile(0,0,1,0), // down only
                         tile_uo: new Tile(0,0,0,1), // up only
                         tile_lr: new Tile(1,1,0,0), // left right
                         tile_du: new Tile(0,0,1,1), // down up
                         tile_ld: new Tile(1,0,1,0), // left down
                         tile_rd: new Tile(0,1,1,0), // right down
                         tile_lu: new Tile(1,0,0,1), // left up
                         tile_ru: new Tile(0,1,0,1), // right up
                         tile_nu: new Tile(1,1,1,0), // no up
                         tile_nd: new Tile(1,1,0,1), // no down
                         tile_nr: new Tile(1,0,1,1), // no right
                         tile_nl: new Tile(0,1,1,1)  // no left
                       };

        /*for(var tile in tiles) {
            tiles[tile].texture_coords = Vec.cast( [0.5,0], [1,0],     [0.5,0.5], [1,0.5],
                                                   [0,0.5], [0.5,0.5], [0,1],     [0.5,1],
                                                   [0,0],   [0.5,0],   [0,0.5],   [0.5,0.5],
                                                   [0,0],   [0.5,0],   [0,0.5],   [0.5,0.5],
                                                   [0,0],   [0.5,0],   [0,0.5],   [0.5,0.5],
                                                   [0,0],   [0.5,0],   [0,0.5],   [0.5,0.5] );
        }*/
        
        this.submit_shapes( context, tiles );

        //SHAPES
        const shapes = { 'box': new Cube(),
        				 square: new Square(),
        				 ball: new Subdivision_Sphere(3),
                         circle: new Rock(),
                         crane: new Crane(),
                         sci_enemy: new Sci_Enemy(),
                         sci_enemy_body: new Sci_Enemy_Body(),
                         frame: new Battle(),
                         card: new Card(),
                         text: new Text_Line( 58 ),
						 title: new Title(),
                         key: new Shape_From_File("assets/Worn_Key.obj"),
                         hydra: new Shape_From_File("assets/boss.obj"),
                         goblet: new Shape_From_File("assets/fg.obj"),
                         rock_low1: new Shape_From_File("assets/rock_low1.obj"),
                         rock_low2: new Shape_From_File("assets/rock_low2.obj"),
                         rock_low3: new Shape_From_File("assets/rock_low3.obj"),
                         cone: new Closed_Cone(10, 10, [[0,4],[0,4]])
        }
      

        this.data = new Test_Data( context );


		this.submit_shapes( context, this.data.shapes );
        this.submit_shapes( context, shapes );

        this.materials =
          { 
            phong: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:0 } ),
            silver: context.get_instance( Phong_Shader ).material( Color.of( .1,.1,.1,1 ), { ambient:0, specularity: 1 } ),

            test: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:1, texture:context.get_instance( "assets/colors.png", false ) } ),
            frame:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/framer.png", true), ambient: 1}),
            card:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/questionCard.png", true), ambient: 1} ),
            rock:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/rockCard.png", true), ambient: 1} ),
            paper:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/paperCard.png", true), ambient: 1} ),
            news:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/ny_times.jpeg", true), ambient: 1} ),
            scissors:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/scissorsCard.png", true), ambient: 1} ), 
			boss:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/scissorsCard.png", true), ambient: 1} ), 
            ro:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/ro.png", true), ambient: 1}),
            sham:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/sham.png", true), ambient: 1}),
            bo:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/bo.png", true), ambient: 1}), 
            win:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/win.png", true), ambient: 1}), 
            lose:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/lose.png", true), ambient: 1}),                                                                        
            draw:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/draw.png", true), ambient: 1}),
            foil_wall:   context.get_instance( Bump_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: [context.get_instance("assets/metal-texture2.jpg", true), context.get_instance("assets/hex-normal.jpg", true)], ambient: 0.2, diffuse: 1, specularity: 1}),  
            rock_wall:    context.get_instance( Bump_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: [context.get_instance("assets/rock_wall.jpg", true),context.get_instance("assets/rock_wall_norm.jpg", true)], ambient: 0.1, diffuse: 1, specularity: 1}),
            title:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/title.png", true), ambient: 1}),
			text_image: context.get_instance( Phong_Shader )
            			      .material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/text.png" ) }),
            paper_wall: context.get_instance( Bump_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: [context.get_instance("assets/lined.jpg", true),context.get_instance("assets/paper_wall.jpg", true)], ambient: 0.6, diffuse: 1}),
            crane: context.get_instance( Phong_Shader )
            			      .material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/graph.png" ) }),
            boss_room_mat: context.get_instance( Bump_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: [context.get_instance("assets/boss_tile.jpg", true),context.get_instance("assets/boss_tile_norm.jpg", true)], ambient: 0, diffuse: 1}),
            metal: context.get_instance( Phong_Shader )
            			      .material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/metal.jpg" ) }),
            red: context.get_instance( Phong_Shader ).material( Color.of( 1,0,0,1 ), { ambient:1 } ),
            orange: context.get_instance( Phong_Shader ).material( Color.of( 0.874, 0.396, 0.027, 1 ), { ambient:1 } ),
			boss_scales: context.get_instance( Phong_Shader )
            			      .material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/scales.jpg" ) }),
            rock_bod:    context.get_instance( Phong_Shader )
            			      .material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/rock_bod.jpg" ) }),
           	reflect_wall:  context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/foil_tile.jpg", true), ambient: 0.9, diffuse: 1, specularity: 1}),
            rockobj:   context.get_instance( Phong_Shader )
                              .material(Color.of(0,0,0,1 ), {texture: context.get_instance("assets/rockobj.jpg", true), ambient: 1} ),
           	reflected_object: context.get_instance( Reflecting_Object ).material( Color.of(0, 0,0, 1), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/star.png", true, true) } ),

          	cubemap_env: context.get_instance( Cubemap ).material( Color.of(0, 0,0, 1), {ambient: 1, texture: context.get_instance("assets/rock.png",true, true) } ),		
                    
          }

        //this.lights = [ new Light( Vec.of( 1,0,1,1 ), Color.of( 1,1,1,1 ), 15 ) ];
        this.lights = [];

        this.music = {
        	center: null,
        	rock: null,
        	paper: null,
        	scissors: null,
        	boss: null
      	}

      	this.current_music = null;

      	this.playPromise = null;

      	this.sounds = {
      		ro: new Audio( "assets/ro.wav" ),
      		sham: new Audio( "assets/sham.wav" ),
      		bo: new Audio( "assets/bo.wav" ),
      		explosion: new Audio( "assets/explosion.wav" )
      	}
                    
        // Edit this array to change the map
        this.tile_map = [ "lu", "nw", "ru",
                          "lo", "nw", "nw",
                          "ld", "nw", "rd" ];
        
        //MAIN MAP OF THE GAME
        //Do not build boss room until player has all treasures
        this.map = [[null,null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,new Room("paper","null","paper"),null,null,null],
                    [null,null,null,null,null,new Room("null","crane","paper"),null,null,null],
                    [null,new Room("null","boss","boss"),new Room("null","soldier","boss"),new Room("null","crane","boss"),null,new Room("null","null","center"),new Room("null","soldier","scissors"),new Room("scissors","null","scissors"),null],
                    [null,null,null,null,null,new Room("null","rock","rock"),null,null,null],
                    [null,null,null,null,null,new Room("rock","null","rock"),null,null,null],
                    [null,null,null,null,null,null,null,null,null]];

        //Contains the current room the player is in.
        this.player_room = Vec.of(3,5);
        this.start_room = Vec.of(3,5);
        
        this.boss_room_built = false;
        
        this.rows = 3;
        this.cols = 3;

        this.tile_length = 2;

        //Touching enemy, object or doorway
        this.touching_door = false;
        this.touching_enemy = false;
        this.touching_obj = false;
        //Object Types:
        this.object_type = "null";
        this.got_rock = false;
        this.got_scissors = false;
        this.got_paper = false;
        this.door_type = "null";
        this.door_type_last = "null";

        //ROTATES CAMERA
        this.rotate_left = false;
        this.rotate_right = false;
        //MOVES PLAYER FORWARD
        this.move_forward = false;
        this.move_backward = false;
        this.velocity = Vec.of(0,0,0);
        this.rotation = 0;

        	 // variables for combat 

         this.fight = false;
         const rock = false;
         const paper = false;
         const scissors = false;
		 const paperCycle = "paper"; 
		 const enemy = "rock";
		 const finished = true;
		 this.win_lose = null;
		 const doOnce = true;
		 this.outcome = null;
         this.rot = 0;
         this.countdown = 0;
         this.init_battle = false;;
         this.drawing = true;
         this.timer = 0;
         this.reference = 0;
         const weapon = null;
         const myTool = this.materials.card;
         const theirTool = this.materials.card;
         const lastMove = this.materials.paper;
         this.begin = false;
         this.outtro = false;
         this.outtime;
         this.intime;
         this.turnOffFire = false;
         this.placement = 0;

        //All rooms have the following walls
        this.walls = [Vec.of(16,0,0,-1),Vec.of(0,0,16,-1),Vec.of(0,0,-2,9),Vec.of(-2,0,0,9)];

      }
      reset () {
		  this.countdown = 0;
          this.rot = 0;
          this.doOnce = true;
          this.myTool = this.materials.card;
          this.theirTool = this.materials.card;
          this.outcome = null;
      }
    make_control_panel()
      { 
            this.key_triggered_button( "Forward",[ "w" ], () => {this.move_forward = true;}, undefined, () => {this.move_forward = false; this.velocity = Vec.of(0,0,0);}  );
            this.key_triggered_button( "Back",   [ "s" ], () => {this.move_backward = true;}, undefined, () => {this.move_backward = false; this.velocity = Vec.of(0,0,0);} );
            this.key_triggered_button( "Turn Left",   [ "a" ], () =>  {this.rotate_left = true;} );
            this.key_triggered_button( "Turn Right",   [ "d" ], () =>  {this.rotate_right = true;} );
            this.key_triggered_button( "Rock their socks off!", [ "1" ], () => {
      	                               if (!this.weapon) {  this.reset(); this.weapon = this.materials.rock; }
                                       } );
            this.key_triggered_button("Paper.", [ "2" ], () => {
                                       if (!this.weapon) {  this.reset(); this.weapon = this.materials.paper; }
                                       } );
            this.key_triggered_button( "Cut 'em up!", [ "3" ], () => {
                                       if (!this.weapon) { this.reset(); this.weapon = this.materials.scissors; }
                                       } );
            this.key_triggered_button( "Start the game!", [ "0" ], () => {this.begin = true; } );
      }

      update_state( dt )
    { 

/*
     //Generate Dust Particles
     if( this.particle_count < 100 )         // Generate moving bodies:
        {
        this.bodies.push( new Body( this.data.shapes.ball, this.material.override( { specularity: 1, texture: this.data.textures.metal } ), Vec.of( 0.1,0.1,0.1 ), "dust" )
              .emplace( Mat4.translation( Vec.of(0,50,0).randomized(50) ),
                        Vec.of(0,-1,0).randomized(2).normalized().times(3), Math.random() ) );
        this.particle_count++;
        }
    //Generate flying paper
    if( this.bodies.length < 20 )         // Generate moving bodies:
        {
        this.bodies.push( new Body( this.data.shapes.square, this.material, Vec.of( 2,2.5,2 ), "paper" )
              .emplace( Mat4.translation( Vec.of(0,20,0).randomized(15) ),
                        Vec.of(0,-1,0).randomized(2).normalized().times(3), Math.random() ) );
        }
      //Generate cones
    if( this.bodies.length < 150 )         // Generate moving bodies:
        {
        this.bodies.push( new Body( this.data.shapes.cone, this.material, Vec.of( 2,2.5,2 ), "cone" )
              .emplace( Mat4.translation( Vec.of(0,50,0).randomized(20) ),
                        Vec.of(0,-1,0).randomized(0).normalized().times(3), Math.random(), Vec.of(1,0,0).normalized( ) ));
        }
*/
    //Generate fire
//     while(  this.bodies.length < 200 )         // Generate moving bodies:
//         {
        
//         this.bodies.push( new Body( this.data.shapes.ball, this.material, Vec.of( 0.5,Math.random(),0.03 ), "fire" )
//               .emplace( Mat4.translation( Vec.of(0,0,0).randomized(5) ),
//                         Vec.of(0,-1,0).randomized(15).normalized().times(5), Math.random() ) );

//         }

		let body = "";
        //Modify the linear_velocity and angular_velocity of each body
        for( let b of this.bodies )
            { 
                if (b.type == "rock")
                {
                    b.linear_velocity[1] -= dt * 3;                     // Gravity on Earth, where 1 unit in world space = 1 meter.
                    if( b.center[1] < -2)
                    {
                        b.linear_velocity[1] *= -.000008; 
                         b.angular_velocity / .0008;

                    }  
                }
                if(b.type == "paper")
                {
                     b.linear_velocity[1] *= dt * 9.8/*6.5*/;                      // Gravity on Earth, where 1 unit in world space = 1 meter.
                     if( b.center[1] < -8 /*&& b.linear_velocity[1] < 0*/ )
                     {
                        b.linear_velocity[1] *= -.0008; 
                        b.angular_velocity *= -.0008;

                     } 
                }   

               if (b.type == "cone")
                {
                    b.linear_velocity[1] += dt * -9.8;                     // Gravity on Earth, where 1 unit in world space = 1 meter.
                    if( b.center[1] < -8)
                    {
                        b.linear_velocity[1] *= -.0008; 
                         b.angular_velocity *= -.0008;

                    }  
                }
                if (b.type == "scary_thing")
                {
                    b.linear_velocity[1] += dt * 8;                     // Gravity on Earth, where 1 unit in world space = 1 meter.
                    if( b.center[1] < -8)
                    {
                        b.linear_velocity[1] *= -.0008; 
                         b.angular_velocity *= -.0008;

                    }
                    b.size[1]--;
                }
                if (b.type == "fire")
                {
                	body = "fire";

                    b.linear_velocity[1] += dt / 2.5;                     // Gravity on Earth, where 1 unit in world space = 1 meter.
                    if( b.center[1] < -8)
                    {
                        b.linear_velocity[1] *= -.0008; 
                         b.angular_velocity *= -.0008;

                    }
                }
    
                               
            } 

        this.prev_body_length = this.bodies.length;
        
		if (body == "fire")
		{
			this.bodies = this.bodies.filter( b => b.center.norm() < (Math.random() * (1.5-0.1) + 0.1));
			
		}
		else
		{
        this.bodies = this.bodies.filter( b => b.center.norm() < 10);
		}

        this.particle_count = this.prev_body_length - this.bodies.length;

		
        
    }

    //Partıcle effect functıons
    create_rock_ball(position)
  {
      //PARTICLES
       if(this.bodies.length < 40)
       {

          for (let i = 0; i<10; i++)
          {
          	let size = (Math.random() * ((0.1-0.01) + 0.01));
        this.bodies.push( new Body( this.shapes.square, this.materials.metal, Vec.of( size,size,size), "paper" )
              .emplace( Mat4.translation( Vec.of(3,0,0).randomized(3) ),
                        Vec.of(0,-1,0).randomized(3).normalized().times(2), Math.random() ) );



          }
       }
        
  }
init_music(type)
  {
	this.music[type] = new Audio( "assets/" + type + "_bgm.ogg" );
	this.music[type].volume = 0.6;
	this.music[type].addEventListener( 'ended', function() {
		this.currentTime = 0;
		this.play();
	}, false );
  }
    display( graphics_state )
      { super.display(graphics_state);
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
		
		

		if (!this.begin) {
			if (t % 1 < .5)
            	this.shapes.text.set_string( "Press 0 to start" );
            else
            	this.shapes.text.set_string( "" );
     	    this.shapes.text.draw( graphics_state, Mat4.translation([1.65,0,0]).times(Mat4.scale([.03,.03,.03])), this.materials.text_image );
			this.intime = t;
			return;
		}

		if (!this.outtro)
			this.outtime = t;

		

		if (this.begin && t-this.intime < 23) {

			let time = t-this.intime;
      
	  		let model_transform = Mat4.identity().times(Mat4.translation([2,0,-2])).times(Mat4.scale([1,1,1]));

      		let masterString = "                     \n" +
      				     "   Rock.       \n\n"+
      			   		 "   Paper.       \n\n"+
				         "   Scissors.         \n\n\n"+

				         "   Long ago, the three nations lived together in harmony.     \n\n\n"+
				         "   But everything changed when the Hydra King attacked.     \n\n\n"+

				         "   Too scaly to be cut, too large to be crushed, and too   \n" + 
				         "   environmentally conscious to be covered with paper,           \n" + 
				         "   he has broken the sacred cycle. \n\n\n" +   

				         "   Only you, the last free master of the ancient art of \n\n" + 
				         "                      R O S H A M B O               \n\n" + 
				         "   can stop him. \n \n \n" + 

				         "   Defeat his enslaved followers, collect the three keys, \n" + 
				         "   and restore balance to your order!"
				         ;

      	let titleString = "                      R O S H A M B O";
 
	  	let speed = 20;
	  	let scan = masterString.length;
	  	if (time < speed)
	  		scan = time/speed*masterString.length;
	  
	 	 let fade = 1;
       	 if (time > speed+1)
        		fade = 1 - (time-speed-1)/1;


     	 let string = masterString.substring(0,scan);

    	  var mapper = model_transform.times(Mat4.translation([ -1.3, .9, 1.01 ]));

    	  for( let line of string.split('\n') ) { 
    	   		this.shapes.text.set_string( line );
     	       this.shapes.text.draw( graphics_state, mapper.times( Mat4.scale([ .03,.03,.03 ])), this.materials.text_image.override({ambient: fade}) );
     	       mapper.post_multiply( Mat4.translation([ 0,-.06,0 ]) );
    	  }  
		
		
	  	if (time > speed) {
				this.shapes.text.set_string( titleString );
				this.shapes.text.draw( graphics_state, model_transform.times(Mat4.translation([-1.3, .9 - 21*.06, 1.02])).times(Mat4.scale([.03,.03,.03])), this.materials.text_image.override({ambient: 1}) );

     	 }

	 	 return; 
		} else
			this.intro = false;

		/////OUTTRO/////
		
		if (this.outtro) {

			let time = t - this.outtime;

			//let model_transform = Mat4.identity().times(Mat4.translation([2,0,-2])).times(Mat4.scale([1,1,1]));
			let model_transform = this.battle.times(Mat4.translation([0,0,-.2]));

      		let masterString =       
      					   "   \n\n\n\n\n\n\n\n\n\n" + 
      					   "   Thank you, hero. \n\n" + 
	 					   "   Your efforts have freed the people of this world. \n\n" +
	 					   "   Under great pressure, you have remained sharp,   \n" + 
	 					   "   sturdy,\ and... \n      " + 
	 					   "              ...papery. \n\n" +
	 					   "   You have proven yourself to be a true master of \n\n                    "  
	 					   ;

      	let titleString = "                      R O S H A M B O"
      	
      	let subString =   "           (Professor Friedman please give us an A)"
      					;
 
	  	let speed = 14;
	  	let scan = masterString.length;
	  	if (time < speed)
	  		scan = time/speed*masterString.length;
	  
	 	 let fade = 1;
       	 if (time > speed + 1)
        		fade = 1 - (time-speed-1)/1;


     	 let string = masterString.substring(0,scan);

    	  var mapper = model_transform.times(Mat4.translation([ -1.3, .9, 1.01 ]));

    	  for( let line of string.split('\n') ) { 
    	   		this.shapes.text.set_string( line );
     	       this.shapes.text.draw( graphics_state, mapper.times( Mat4.scale([ .03,.03,.03 ])), this.materials.text_image.override({ambient: fade}) );
     	       mapper.post_multiply( Mat4.translation([ 0,-.06,0 ]) );
    	  }  
		
		
	  	if (time > speed) {
				this.shapes.text.set_string( titleString );
				this.shapes.text.draw( graphics_state, model_transform.times(Mat4.translation([-1.3, .9 - 21*.06, 1.02])).times(Mat4.scale([.03,.03,.03])), this.materials.text_image.override({ambient: 1}) );
     	 }

		if (time > speed + 2) {
				this.shapes.text.set_string( subString );
				this.shapes.text.draw( graphics_state, model_transform.times(Mat4.translation([-1.3, .9 - 24*.06, 1.02])).times(Mat4.scale([.03,.03,.03])), this.materials.text_image.override({ambient: 1}) );
     	 }	

	 	 return; 
		}

		var lastFireIntensity = 20;

        var model_transform = Mat4.identity();
        var tile_material = this.materials.test;

        var next_music;

        if(this.map[this.player_room[0]][this.player_room[1]].room_type == "scissors")
        {
        	this.lights = [ new Light( Vec.of( 2,1,2 + 2 * Math.sin(t),1 ), Color.of( 0.5,0.3,1,1 ), 10 ) ];

        	//this.shapes["box"].draw( graphics_state, model_transform.times(Mat4.translation([2,1,2])).times(Mat4.scale([ 10,10,10 ])), this.materials.reflect_wall );

        	let model_transform2 = Mat4.identity();

			model_transform2 = model_transform2.times(Mat4.scale([.3,.3,.3]).times(Mat4.translation([0,0,0])));
        	this.shapes.cone.draw(graphics_state, model_transform2.times( Mat4.scale( [ 0.5, 2.5, 0.5 ] ) ).times( Mat4.rotation( Math.PI / 2, Vec.of( 1, 0, 0 ) ) ).times( Mat4.translation( [ 0.0, 0.0, -0.5 ] ) ), 
        		this.materials.reflected_object);
        	this.shapes.cone.draw(graphics_state, model_transform2.times( Mat4.scale( [ 0.5, 2.5, 0.5 ] ) ).times( Mat4.rotation( Math.PI / 2, Vec.of( 1, 0, 0 ) ) ).times( Mat4.translation( [ 27.0, 0.0, -0.5 ] ) ), 
        		this.materials.reflected_object);
        	this.shapes.cone.draw(graphics_state, model_transform2.times( Mat4.scale( [ 0.5, 2.5, 0.5 ] ) ).times( Mat4.rotation( Math.PI / 2, Vec.of( 1, 0, 0 ) ) ).times( Mat4.translation( [ 0.0, 27.0, -0.5 ] ) ), 
        		this.materials.reflected_object);
        	this.shapes.cone.draw(graphics_state, model_transform2.times( Mat4.scale( [ 0.5, 2.5, 0.5 ] ) ).times( Mat4.rotation( Math.PI / 2, Vec.of( 1, 0, 0 ) ) ).times( Mat4.translation( [ 27.0, 27.0, -0.5 ] ) ), 
        		this.materials.reflected_object);


        	tile_material = this.materials.foil_wall;
        	this.create_rock_ball(Vec.of(20,15,0));

        	next_music = this.music.scissors;

        	if(next_music == null) {
        		this.init_music( "scissors" );
        		next_music = this.music.scissors;
        	}
        }
        if(this.map[this.player_room[0]][this.player_room[1]].room_type == "rock")
        {

        	this.lights = [ new Light( Vec.of( 0.5 + 2 * Math.sin(t), -2.5 + 2 * Math.sin(t), 0 + 1 * Math.sin(2 * t), 1 ), Color.of( 1,0,0,1 ), 15.0 ) ];

        	tile_material = this.materials.rock_wall;
        	this.generate_fire();
        	//Draw decorative objects
        	this.shapes.goblet.draw( graphics_state, model_transform.times(Mat4.scale([0.25,0.25,0.25])).times(Mat4.translation([0.5,-2.5,0])), this.materials.metal );
        	
				

			//Position 1
        	var model_transform = Mat4.identity();
				this.shapes.rock_low1.draw( graphics_state, model_transform.times(Mat4.scale([0.25,0.25,0.25])).times(Mat4.translation([15,-3.5,-2])), this.materials.rock_bod );
				this.shapes.rock_low2.draw( graphics_state, model_transform.times(Mat4.translation([4,-0.9,0])).times(Mat4.scale([0.25,0.5,0.3])), this.materials.rock_bod );
				this.shapes.rock_low1.draw( graphics_state, model_transform.times(Mat4.scale([0.1,0.1,0.1])).times(Mat4.translation([35,-10,-1])).times(Mat4.rotation(45, Vec.of(1,0,0))), this.materials.rock_bod );
			//Position 2
			this.shapes.rock_low1.draw( graphics_state, Mat4.identity().times(Mat4.scale([0.25,0.25,0.25])).times(Mat4.translation([15,-3.5,18])), this.materials.rock_bod );
				this.shapes.rock_low2.draw( graphics_state, Mat4.identity().times(Mat4.translation([4.5,-0.9,4.5])).times(Mat4.scale([0.4,0.4,0.6])).times(Mat4.rotation(45, Vec.of(1,0,0))), this.materials.rock_bod );
				this.shapes.rock_low1.draw( graphics_state, Mat4.identity().times(Mat4.scale([0.3,0.5,0.3])).times(Mat4.translation([14,-1,16])).times(Mat4.rotation(75, Vec.of(1,0,0))), this.materials.rock_bod );
			

            

        	next_music = this.music.rock;

        	if(next_music == null) {
        		this.init_music( "rock" );
        		next_music = this.music.rock;
        	}
        }
        if(this.map[this.player_room[0]][this.player_room[1]].room_type == "paper")
        {
        	this.lights = [ new Light( Vec.of( 2 + Math.sin(2 * t),1,2 + Math.sin(2 * t),1 ), Color.of( 1,1,1,1 ), 20 ) ];

        	tile_material = this.materials.paper_wall;
        	this.generate_paper();

        	//draw decorative items
			//paperclips
			
				

        	next_music = this.music.paper;

        	if(next_music == null) {
        		this.init_music( "paper" );
        		next_music = this.music.paper;
        	}
        }
        if(this.map[this.player_room[0]][this.player_room[1]].room_type == "center")
        {
        	this.lights = [ new Light( Vec.of( 2,1,2,1 ), Color.of( 1,1,1,1 ), 20 ) ];

//         	let model_transform1 = Mat4.identity();
//         let model_transform2 = Mat4.identity();
         
//             //THIS IS THE CUPEMAP SHAPE
//       model_transform1 = model_transform1.times(Mat4.scale([30,30,30]));       
//       this.shapes['box'].draw(graphics_state, model_transform1, this.materials.cubemap_env);

        
 
//          //THIS IS WHAT GOES IN THE CUPEMAP
//         model_transform2 = model_transform2.times(Mat4.scale([.3,.3,.3]).times(Mat4.translation([0,0,0])));
//         this.shapes.circle.draw(graphics_state, model_transform2, this.materials.reflected_object);

			next_music = this.music.center;

        	if(next_music == null) {
        	    this.init_music( "center" );
        	    next_music = this.music.center;
        	}
        	
        }
        if(this.map[this.player_room[0]][this.player_room[1]].room_type == "boss")
        {
        	this.lights = [ new Light( Vec.of( 0.5 + 2 * Math.sin(t), -2.5 + 2 * Math.sin(t), 0 + 0.5 * Math.sin(2 * t), 1 ), Color.of( 1,0,0,1 ), 15.0 ) ];

        	tile_material = this.materials.boss_room_mat;
        	this.generate_fire();
        	this.shapes.goblet.draw( graphics_state, model_transform.times(Mat4.scale([0.25,0.25,0.25])).times(Mat4.translation([0.5,-2.5,0])), this.materials.metal );

        	next_music = this.music.boss;

        	if(next_music == null) {
        	    this.init_music( "boss" );
        	    next_music = this.music.boss;
        	}
        }

        if (this.current_music == null) {
		    this.playPromise = next_music.play();
		}
        else if( this.current_music != next_music ) {
        	if( this.playPromise !== undefined )
        	{
        		this.current_music.pause();
        		this.current_music.currentTime = 0;
        	}
        	this.playPromise = next_music.play();
        }

        this.current_music = next_music;

//Partıcle effect test
		
        // Map creation
        for( var i = 0; i < this.rows; i++ ) 
        {
            for( var j = 0; j < this.cols; j++ )
            {
                switch( this.tile_map[ i * this.cols + j ] ) {
                case "nw":
                    this.shapes.tile_nw.draw( graphics_state, model_transform, tile_material );
                    break;
                case "lo":
                    this.shapes.tile_lo.draw( graphics_state, model_transform, tile_material );
                    break;
                case "ro":
                    this.shapes.tile_ro.draw( graphics_state, model_transform, tile_material );
                    break;
                case "do":
                    this.shapes.tile_do.draw( graphics_state, model_transform, tile_material );
                    break;
                case "uo":
                    this.shapes.tile_uo.draw( graphics_state, model_transform, tile_material );
                    break;
                case "lr":
                    this.shapes.tile_lr.draw( graphics_state, model_transform, tile_material );
                    break;
                case "du":
                    this.shapes.tile_du.draw( graphics_state, model_transform, tile_material );
                    break;
                case "ld":
                    this.shapes.tile_ld.draw( graphics_state, model_transform, tile_material );
                    break;
                case "rd":
                    this.shapes.tile_rd.draw( graphics_state, model_transform, tile_material );
                    break;
                case "lu":
                    this.shapes.tile_lu.draw( graphics_state, model_transform, tile_material );
                    break;
                case "ru":
                    this.shapes.tile_ru.draw( graphics_state, model_transform, tile_material );
                    break;
                case "nu":
                    this.shapes.tile_nu.draw( graphics_state, model_transform, tile_material );
                    break;
                case "nd":
                    this.shapes.tile_nd.draw( graphics_state, model_transform, tile_material );
                    break;
                case "nr":
                    this.shapes.tile_nr.draw( graphics_state, model_transform, tile_material );
                    break;
                case "nl":
                    this.shapes.tile_nl.draw( graphics_state, model_transform, tile_material );
                    break;
                default:
                    break;
                }

                model_transform = model_transform.times( Mat4.translation( [ this.tile_length, 0, 0 ] ) );
            }

            model_transform = model_transform.times( Mat4.translation( [ -this.tile_length * this.cols, 0, this.tile_length ] ) );
        }

        //Draw in enemy if there is one
        let enemy_transform = Mat4.identity();
        //ROCK
        if(this.map[this.player_room[0]][this.player_room[1]].enemy_type == "rock")
        {
            //console.log(this.player_room);
            
            
            if(this.map[this.player_room[0]][this.player_room[1]].room_type == "boss")
            {
				enemy_transform = enemy_transform.times(Mat4.translation([0,0.3,2]));
            	enemy_transform = enemy_transform.times(Mat4.scale([0.06,0.06,0.06]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(0.5*Math.PI,[0,1,0]));

            }
            else
            {
				enemy_transform = enemy_transform.times(Mat4.translation([2,0.3,4]));
            	enemy_transform = enemy_transform.times(Mat4.scale([0.06,0.06,0.06]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(Math.PI,[0,1,0]));
            }
            this.shapes.circle.draw(graphics_state, enemy_transform, this.materials.rock_bod);

		
        }
        //CRANE
        if(this.map[this.player_room[0]][this.player_room[1]].enemy_type == "crane")
        {
            //console.log(this.player_room);
            if(this.map[this.player_room[0]][this.player_room[1]].room_type == "boss")
            {
				enemy_transform = enemy_transform.times(Mat4.translation([0.5,0.4,2.5]));
            	enemy_transform = enemy_transform.times(Mat4.scale([0.25,0.25,0.25]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(0.7*Math.PI,[0,1,0]));
            }
            else
            {
            	enemy_transform = enemy_transform.times(Mat4.translation([1.5,0.4,0.5]));
            	enemy_transform = enemy_transform.times(Mat4.scale([0.25,0.25,0.25]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(0.3*Math.PI,[0,1,0]));
            }
            this.shapes.crane.draw(graphics_state, enemy_transform, this.materials.crane);
        }
        //SOLDIER
        if(this.map[this.player_room[0]][this.player_room[1]].enemy_type == "soldier")
        {
            //console.log(this.player_room);
            if(this.map[this.player_room[0]][this.player_room[1]].room_type == "boss")
            {
				enemy_transform = enemy_transform.times(Mat4.translation([0,-0.17,2]));
            	enemy_transform = enemy_transform.times(Mat4.scale([0.1,0.1,0.1]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(0.5*Math.PI,[0,1,0]));
            }
            else
            {
            	enemy_transform = enemy_transform.times(Mat4.translation([4,-0.17,2]));
            	enemy_transform = enemy_transform.times(Mat4.scale([0.1,0.1, 0.1]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(1.5*Math.PI,[0,1,0]));
            }
            this.create_SciEnemy(graphics_state, enemy_transform);
        }
        //BOSS
        if(this.map[this.player_room[0]][this.player_room[1]].enemy_type == "boss")
        {
            	enemy_transform = Mat4.identity();
            	enemy_transform = enemy_transform.times(Mat4.scale([0.5,0.5,0.5]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(.5*Math.PI,[1,0,0]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(1*Math.PI,[0,1,0]));
            	enemy_transform = enemy_transform.times(Mat4.translation([0,3.9,-.2]));
            	enemy_transform = enemy_transform.times(Mat4.rotation(.5*Math.PI,[0,0,1]));
//            this.shapes.hydra.draw(graphics_state, enemy_transform, this.materials.phong);
            
           this.shapes.hydra.draw(graphics_state, enemy_transform, this.materials.boss_scales);
        }
        //KEY
        let key_transform = Mat4.identity();
        if(this.map[this.player_room[0]][this.player_room[1]].object_type != "null")
        {
        	if(this.map[this.player_room[0]][this.player_room[1]].room_type == "scissors")
            {
				key_transform = key_transform.times(Mat4.translation([4,0,2]));
            	key_transform = key_transform.times(Mat4.scale([0.25,0.25, 0.25]));
            	key_transform = key_transform.times(Mat4.rotation(0.5*Math.PI,[0,1,0]));
            	key_transform = key_transform.times(Mat4.rotation(1.5*Math.PI,[0,0,1]));
            }
            if(this.map[this.player_room[0]][this.player_room[1]].room_type == "paper")
            {
            	key_transform = key_transform.times(Mat4.translation([2,0,0.5]));
            	key_transform = key_transform.times(Mat4.scale([0.25,0.25,0.25]));
            	key_transform = key_transform.times(Mat4.rotation(0.5*Math.PI,[0,0,1]));
            	key_transform = key_transform.times(Mat4.rotation(1*Math.PI,[0,1,0]));
         
            }
            if(this.map[this.player_room[0]][this.player_room[1]].room_type == "rock")
            {
				key_transform = key_transform.times(Mat4.translation([2,0,4]));
            	key_transform = key_transform.times(Mat4.scale([0.25,0.25,0.25]));
            	key_transform = key_transform.times(Mat4.rotation(1.5*Math.PI,[0,0,1]));
            }
            this.shapes.key.draw(graphics_state, key_transform, this.materials.test);

        }

        //Check if player has all treasures
        if(this.boss_room_built == false && this.got_rock == true && this.got_paper == true && this.got_scissors == true)
        {
              this.boss_room_built = true;
              this.map[this.start_room[0]][this.start_room[1]-1] = new Room("null","rock","boss");
        }
        
        //Check if player is touching...
        this.touching(graphics_state);

        //FIGHT?
        if(this.fight == true)
        {
                  //this.attached = () => this.battle;
		          
		          this.reference = 0;
                  // this.weapon = null;
                  if(this.init_battle== true)
                  {
                        this.drawing = true;
                  }
                  if (!this.finished)  //need this so that it clears if done
			         this.combat(graphics_state);
			      if(this.win_lose == true)
			      {
					  this.map[this.player_room[0]][this.player_room[1]].enemy_type = "null";
					  this.turnOffFire = true;
					  this.generate_blast();

					  this.sounds.explosion.play();

					  if (this.enemy == "boss" ) {
						this.outtro = true;
						return;
					}
					  
			      }
			      if (this.win_lose == false) {
					  this.player_loses(graphics_state);
			      	  
			      }

				 if (this.finished) {
				  	this.reset();
					this.win_lose = null;
					this.turnOffFire = false;

					

				 } 

                  this.touching_enemy = false;

        }

        //Move player?
        let movement = this.move_player(graphics_state,dt);
        graphics_state.camera_transform = movement;

      }
      //Rotates the player for tank control 
      move_player(graphics_state,dt)
      {
          let temp = Mat4.inverse( graphics_state.camera_transform);
          this.battle = temp;
          this.battle = this.battle.times(Mat4.translation([0,0,-3]));
          //let origin = Vec.of(0,0,0,1);
          //temp = temp.times(origin);
          
          let origin = Vec.of(0,0,0,1);
          let char_pos = temp.times(origin);
          //console.log(char_pos);
          
          if(this.rotate_right == true)
          {
              temp = temp.times(Mat4.rotation( -0.05*Math.PI, Vec.of( 0,1,0 )));
              this.rotation = (this.rotation + 0.05*Math.PI)%(2*Math.PI);
              this.rotate_right = false;
          }
          if(this.rotate_left == true)
          {
              temp = temp.times(Mat4.rotation( 0.05*Math.PI, Vec.of( 0,1,0 )));
              this.rotation = (this.rotation - 0.05*Math.PI)%(2*Math.PI);
              this.rotate_left = false;
          }

          if(this.move_forward == true)
          {
                         
              this.velocity = this.velocity.plus(Vec.of(0,0,-0.2*dt));
             
              /*else
              {
                  this.velocity = this.velocity.plus(Vec.of(0.2*dt*Math.cos(this.rotation),0,0));
              }*/
          }
          if(this.move_backward == true)
          {
                this.velocity = this.velocity.plus(Vec.of(0,0,0.2*dt));
              
              //else
              //{
              //this.velocity = this.velocity.plus(Vec.of(0.2*dt*Math.cos(this.rotation),0,0));
              //}
          }
          let old_temp = temp;
          temp = temp.times(Mat4.translation(this.velocity));
          char_pos = temp.times(origin);
          if(this.out_of_bounds(char_pos) == true || this.finished == false)
          {
                temp = old_temp;
          }
          if(this.check_door(char_pos) == true)
          {
                this.touching_door = true;
          }
          if(this.check_enemy(char_pos) == true && this.touching_door == false)
          {
                this.touching_enemy = true;
                this.enemy = this.map[this.player_room[0]][this.player_room[1]].enemy_type;
                this.finished = false;
          }
          if(this.check_key(char_pos) == true)
          {
                this.touching_obj = true;
          }
          temp = Mat4.inverse(temp);
          
          return temp;
      }

      out_of_bounds(char_pos)
      {
            for(var i = 0; i<this.walls.length; i++)
            {
                  let is_in_or_out = char_pos.dot(this.walls[i]);
                  //console.log(is_in_or_out);
                  if(is_in_or_out < 0)
                  {
                        return true;
                  }
            }
            return false;
      }

      check_door(char_pos)
      {
            if(this.tile_map[1] == "nw")
            {
                  if(char_pos[2] < 0.16 && char_pos[0] > 1 && char_pos[0]<3)
                  {
                        console.log("Touching north door");
                        this.door_type = "north";
                        this.door_type_last = this.door_type;
                        return true;

                  }
            }
            if(this.tile_map[3] == "nw")
            {
                  if(char_pos[0] < 0.16 && char_pos[2] > 1 && char_pos[2]<3)
                  {
                        console.log("Touching west door");
                        this.door_type = "west";
                        this.door_type_last = this.door_type;
                        return true;
                        
                  }
            }
            if(this.tile_map[5] == "nw")
            {
                  if(char_pos[0] > 4.37 && char_pos[2] > 1 && char_pos[2]<3)
                  {
                        console.log("Touching east door");
                        this.door_type = "east";
                        this.door_type_last = this.door_type;
                        return true;
                        
                  }
            }
            if(this.tile_map[7] == "nw")
            {
                  if(char_pos[2] > 4.37  && char_pos[0] > 1 && char_pos[0]<3)
                  {
                        console.log("Touching south door");
                        this.door_type = "south";
                        this.door_type_last = this.door_type;
                        return true;
                        
                  }
            }
            return false;
      }

      check_enemy(char_pos)
      {
            if(this.map[this.player_room[0]][this.player_room[1]].enemy_type != "null")
            {
                  if(this.door_type_last == "north")
                  {
                        if(char_pos[2] < 2.75 && char_pos[0] > 1 && char_pos[0] < 3)
                        {
                              return true;
                        }
                  }
                  if(this.door_type_last == "west")
                  {
                        if(char_pos[0] < 2.5 && char_pos[2] > 1 && char_pos[2]<3)
                        {
                              return true;
                        }
                  }
                  if(this.door_type_last == "east")
                  {
                        if(char_pos[0] > 2 && char_pos[2] > 1 && char_pos[2]<3)
                        {
                              return true;
                        }
                  }
                  if(this.door_type_last == "south")
                  {
                        if(char_pos[2] > 2.25 && char_pos[0] > 1 && char_pos[0]<3)
                        {
                              return true;
                        }
                  }
            }
            return false;
      }

      check_key(char_pos)
      {
            if(this.map[this.player_room[0]][this.player_room[1]].object_type != "null")
            {
                  if(this.door_type_last == "north")
                  {
                        if(char_pos[2] < 1.5 && char_pos[0] > 1 && char_pos[0]<3)
                        {
                              return true;
                        }
                  }
                  if(this.door_type_last == "west")
                  {
                        if(char_pos[0] < 1.5 && char_pos[2] > 1 && char_pos[2]<3)
                        {
                              return true;
                        }
                  }
                  if(this.door_type_last == "east")
                  {
                        if(char_pos[0] > 2.5 && char_pos[2] > 1 && char_pos[2]<3)
                        {
                              return true;
                        }
                  }
                  if(this.door_type_last == "south")
                  {
                        if(char_pos[2] > 2.5 && char_pos[0] > 1 && char_pos[0]<3)
                        {
                              return true;
                        }
                  }
            }
            return false;
      }

      touching(graphics_state)
      {
            if(this.touching_enemy)
            {
                  //console.log("Time to fight!");
                  //COMMENCE BATTLE
                  this.fight = true;
            }
            if (this.touching_obj)
            {
                  //Pickup Object
                  if(this.map[this.player_room[0]][this.player_room[1]].object_type == "null")
                  {
                        return;
                  }
                  if(this.map[this.player_room[0]][this.player_room[1]].object_type == "rock")
                  {
                        this.got_rock = true;
                        console.log("got rock key");
                        this.map[this.player_room[0]][this.player_room[1]].object_type = "null";
                  }
                  if(this.map[this.player_room[0]][this.player_room[1]].object_type == "scissors")
                  {
                        this.got_scissors = true;
                        console.log("got scissors key");
                        this.map[this.player_room[0]][this.player_room[1]].object_type = "null";
                  }
                  if(this.map[this.player_room[0]][this.player_room[1]].object_type == "paper")
                  {
                        this.got_paper = true;
                        console.log("got paper key");
                        this.map[this.player_room[0]][this.player_room[1]].object_type = "null";
                  }
                  this.touching_obj = false;
            }
            if(this.touching_door)
            {
                  //Transport to next room
                  this.teleport(graphics_state);
                  this.build_room();
            }
      }

      build_room()
      {
            this.door_type = "null"
            this.touching_door = false;
            //Is there a room to the north?
            if(this.map[this.player_room[0]-1][this.player_room[1]] != null)
            {
                  this.tile_map[1] = "nw";
            }
            else
            {
                  this.tile_map[1] = "uo";
            }
            //Is there a room to the west?
            if(this.map[this.player_room[0]][this.player_room[1]-1] != null)
            {
                  this.tile_map[3] = "nw";
            }
            else
            {
                  this.tile_map[3] = "lo";
            }
            //Is there a room to the west?
            if(this.map[this.player_room[0]][this.player_room[1]+1] != null)
            {
                  this.tile_map[5] = "nw";
            }
            else
            {
                  this.tile_map[5] = "ro";
            }
            //Is there a room to the south?
            if(this.map[this.player_room[0]+1][this.player_room[1]] != null)
            {
                  this.tile_map[7] = "nw";
            }
            else
            {
                  this.tile_map[7] = "do";
            }
      }
      teleport(graphics_state)
      {
            if(this.door_type == "north")
            {
                  let temp = Mat4.identity().times(Mat4.translation([ -2,0,-4.2]));
                  temp = Mat4.rotation( this.rotation, Vec.of( 0,1,0 )).times(temp);
                  graphics_state.camera_transform = temp;
                  this.player_room[0] = this.player_room[0] - 1;
            }
            if(this.door_type == "west")
            {
                  let temp = Mat4.identity().times(Mat4.translation([ -4.2,0,-2]));
                  temp = Mat4.rotation( this.rotation, Vec.of( 0,1,0 )).times(temp);
                  graphics_state.camera_transform = temp;
                  this.player_room[1] = this.player_room[1] - 1;
            }
            if(this.door_type == "east")
            {
                  let temp = Mat4.identity().times(Mat4.translation([ -0.25,0,-2]));
                  temp = Mat4.rotation( this.rotation, Vec.of( 0,1,0 )).times(temp);
                  graphics_state.camera_transform = temp;
                  this.player_room[1] = this.player_room[1] + 1;
            }
            if(this.door_type == "south")
            {
                  let temp = Mat4.identity().times(Mat4.translation([ -2,0,-0.25]));
                  temp = Mat4.rotation( this.rotation, Vec.of( 0,1,0 )).times(temp);
                  graphics_state.camera_transform = temp;
                  this.player_room[0] = this.player_room[0] + 1;
            }
      }

      create_SciEnemy(graphics_state, transform)
      {
       this.shapes.sci_enemy.draw(graphics_state, transform, this.materials.silver);
       this.shapes.sci_enemy_body.draw(graphics_state, transform, this.materials.metal);
      }

       reset() {
       	this.weapon = null;
		  this.countdown = 0;
          this.rot = 0;
          this.doOnce = true;
          this.myTool = this.materials.card;
          this.theirTool = this.materials.card;
          this.outcome = null;
      }

      combat(graphics_state) { //sets outcome to this.materials.win if win, .lose if lose
							 //automatically restarts if outcome is a draw

		const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

		//let temp = Mat4.inverse( graphics_state.camera_transform);
        //let model_transform = temp.times(Mat4.translation([0,0,-.2]));
                let model_transform = this.battle.times(Mat4.translation([0,0,-.2]));


		if (!this.enemy)
			this.enemy = "rock";

		if (this.finished) //allows us to clear the game if we've won or lost
			return;

		if (this.drawing) { //makes the frame zoom into view
			this.timer = this.timer + dt;
			let scale = this.timer/2;
        	this.shapes.frame.draw(graphics_state, model_transform.times(Mat4.translation([0,0,2.5]))
        														  .times(Mat4.scale([0.25*scale, 0.25*scale, 0.25*scale]))
        														  .times(Mat4.rotation(.5*Math.PI+scale*1.5*Math.PI,Vec.of(0,0,1))), this.materials.frame);
			if (this.timer > 2) {
				this.drawing = false;
				this.init_battle = false;
				this.timer = 0;
			}
			return;
		}
			
        this.shapes.frame.draw(graphics_state, model_transform.times(Mat4.translation([0,0,2.5])).times(Mat4.scale([0.25, 0.25, 0.25])), this.materials.frame);
			

        if (this.weapon && this.weapon != this.materials.card) { //if a move has been made
		   if (this.reference < .001)
		   		this.reference = t;
		  
		   this.countdown = this.countdown + dt;
		   if (this.countdown < 1.5) {
		      if (this.countdown  < .5)
		      {
		      	this.shapes.card.draw(graphics_state,  model_transform.times(Mat4.translation([0,0,3])).times(Mat4.scale([.1,.1,.1])), this.materials.ro);
		      	this.sounds.ro.play();
		      }
		  	  else if (this.countdown < 1)
		  	  {
		     	this.shapes.card.draw(graphics_state,  model_transform.times(Mat4.translation([0,0,3])).times(Mat4.scale([.1,.1,.1])), this.materials.sham);
		     	this.sounds.sham.play();
		  	  }
		  	  else if (this.countdown < 1.5)
		  	  {
		      	this.shapes.card.draw(graphics_state,  model_transform.times(Mat4.translation([0,0,3])).times(Mat4.scale([.1,.1,.1])), this.materials.bo);
		      	this.sounds.bo.play();
		  	  }
		   } else {
	          this.myTool = this.weapon;
	          if (this.doOnce) {
	          	this.getEnemyMove(t);
		      	this.lastMove = this.weapon;
			  	this.doOnce = false;
	          }
	       	  this.rot = this.rot + 3*dt;
		      if (this.countdown > 2)
				this.getOutcome();
		   }

        } else { //if we're still waiting for the player, draw question mark cards
        	this.myTool = this.materials.card;
        	this.theirTool = this.materials.card;
        }
        

		let enemyType = this.materials.rock;
      	if (this.enemy == "crane")
			enemyType = this.materials.paper;
      	else if (this.enemy == "soldier")
      	  	enemyType = this.materials.scissors;
      	else if (this.enemy == "boss")
      		enemyType = this.materials.boss;


      	this.shapes.card.draw(graphics_state, model_transform.times(Mat4.translation([-.05,.02,3])) //developer tool to see what enemy you're fighting
                                                            .times(Mat4.scale([.03,.03,.03])), enemyType);

        this.shapes.card.draw(graphics_state, model_transform.times(Mat4.translation([-.05,-.03,3]))  //player card
                                                            .times(Mat4.rotation(this.rot,Vec.of(0,1,0)))
                                                            .times(Mat4.scale([.03,.03,.03])), this.myTool);

        this.shapes.card.draw(graphics_state, model_transform.times(Mat4.translation([.05,.02,3]))  //enemy card
                                                            .times(Mat4.rotation(this.rot,Vec.of(0,1,0)))
                                                            .times(Mat4.scale([.03,.03,.03])), this.theirTool);    
		
		if (this.outcome) // displays "You Win", "You Lose", or "Draw"
			this.shapes.card.draw(graphics_state,  model_transform.times(Mat4.translation([0,0,2.7])).times(Mat4.scale([.3,.3,.3])), this.outcome);

		if (this.outcome!= null && this.countdown > 4.5) {
				this.weapon = null;
				this.finished = true;
				this.init_battle = true;
				this.fight = false;
				this.outcome = false;
		}


        
		if( this.attached ) { 
		  const desired_camera = Mat4.inverse( this.attached().times( Mat4.translation([ 0,0,5 ]) ) );
          graphics_state.camera_transform = desired_camera.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 4*dt ) );

        }
	}


	getEnemyMove(t) {
		if (this.enemy == "rock")
			this.theirTool = this.materials.rock;
		else if (this.enemy == "crane") {
			if (this.paperCycle == "rock") {
				this.paperCycle = "paper";
				this.theirTool = this.materials.rock;
			} else if (this.paperCycle == "paper") {
				this.paperCycle = "scissors";
				this.theirTool = this.materials.paper;
			} else {
				this.paperCycle = "rock";
				this.theirTool = this.materials.scissors;
			}
		} else if (this.enemy == "soldier"){
			if (this.lastMove == this.materials.rock)
				this.theirTool = this.materials.paper;
			else if (this.lastMove == this.materials.scissors)
				this.theirTool = this.materials.rock;
			else
				this.theirTool = this.materials.scissors;			
		} else {
			let random = t % 3;
			if (random < 1)
				this.theirTool = this.materials.paper;
			else if (random < 2)
				this.theirTool = this.materials.rock;
			else
				this.theirTool = this.materials.scissors;
		}
	}
	
	player_loses(graphics_state)
	{
		let temp = Mat4.identity().times(Mat4.translation([ -2,0,-2]));
        temp = Mat4.rotation( this.rotation, Vec.of( 0,1,0 )).times(temp);
        graphics_state.camera_transform = temp;
        //console.log(this.start_room);
        this.player_room = Vec.of(3,5);
        this.build_room();
	}

	generate_paper()
    {
		if( this.bodies.length < 20 )         // Generate moving bodies:
        {
        let size = (Math.random()* (0.2-0.05) + 0.05)
        this.bodies.push( new Body( this.shapes.square, this.materials.news, Vec.of( size,size*1.5,size), "paper" )
              .emplace( Mat4.translation( Vec.of(3,0,0).randomized(3) ),
                        Vec.of(0,-0.1,0).randomized(2).normalized().times(1), Math.random() ) );
        }
    }

    generate_fire()
    {
    	if(  this.bodies.length < 150 && this.turnOffFire == false )         // Generate moving bodies:       {
        {
      
         this.bodies.push( new Body( this.shapes.crane, this.materials.red, Vec.of( 0.03,0.03,0.001 ), "fire" )
               .emplace( Mat4.translation( Vec.of(0,0,0) ),
                         Vec.of(0,0.01,0).randomized(3).normalized().times(0.2), Math.random() ) ); 
         this.bodies.push( new Body( this.shapes.crane, this.materials.orange, Vec.of( 0.04,0.04,0.004 ), "fire" )
               .emplace( Mat4.translation( Vec.of(0,0,0) ),
                         Vec.of(0,0.01,0).randomized(1).normalized().times(0.05), Math.random() ) );
                         this.bodies.push( new Body( this.shapes.crane, this.materials.red, Vec.of( 0.04,0.06,0.005 ), "fire" )
               .emplace( Mat4.translation( Vec.of(0,0,0) ),
                         Vec.of(0,0.01,0).randomized(1).normalized().times(0.1), Math.random() ) );
        }              
    }

    generate_blast()
    {
    	while(  this.bodies.length < 200 )         // Generate moving bodies:       {
        {
         this.bodies.push( new Body( this.shapes.ball, this.materials.test, Vec.of( 0.5,Math.random(),0.03 ), "scary_thing" )
               .emplace( Mat4.translation( Vec.of(0,0,0).randomized(5) ),
                         Vec.of(0,-1,0).randomized(15).normalized().times(5), Math.random() ) ); 
        }        
    }

	getOutcome() {
		this.outcome = this.materials.draw;
       	if (this.myTool == this.materials.rock) {
      		if (this.theirTool == this.materials.scissors)
      		{
      			this.outcome = this.materials.win;
      			this.win_lose = true;
      		}
        	else if (this.theirTool == this.materials.paper)
        	{
        		this.outcome = this.materials.lose;
        		this.win_lose = false;
        	}
       	} else if (this.myTool == this.materials.paper) {
        	if (this.theirTool == this.materials.rock)
        	{
        		this.outcome = this.materials.win;
        		this.win_lose = true;
        	}
        	else if (this.theirTool == this.materials.scissors)
        	{
        		this.outcome = this.materials.lose;
        		this.win_lose = false;
        	}
        } else if (this.myTool == this.materials.scissors){
        	if (this.theirTool == this.materials.paper)
        	{
        		this.outcome = this.materials.win;
        		this.win_lose = true;
        	}
        	else if (this.theirTool == this.materials.rock)
        	{
        		this.outcome = this.materials.lose;
        		this.win_lose = false;
        	}
        }
	}

	 show_explanation( document_element )
    { document_element.innerHTML += ``;
    }
  }

class Room
{constructor(object_type, enemy_type, room_type )
{
      Object.assign(this, {object_type, enemy_type, room_type });
}

}
