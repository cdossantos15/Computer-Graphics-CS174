window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,5 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        const shapes = { box:   new Cube(),
                         box_2: new Cube(),
                         axis:  new Axis_Arrows()
                       }

        shapes.box_2.texture_coords =  [ 
               Vec.of(0,0), Vec.of(2,0),
               Vec.of(0,2), Vec.of(2, 2),
               Vec.of(0, 0), Vec.of(2, 0),
               Vec.of(0,2), Vec.of(2, 2),
               Vec.of(0, 0), Vec.of(2, 0),
               Vec.of(0, 2), Vec.of(2, 2),
               Vec.of(0, 0), Vec.of(2, 0),
               Vec.of(0, 2), Vec.of(2, 2),
               Vec.of(0, 0), Vec.of(2, 0),
               Vec.of(0, 2), Vec.of(2, 2),
               Vec.of(0, 0), Vec.of(2, 0),
               Vec.of( 0, 2), Vec.of(2, 2)]
                          
        this.submit_shapes( context, shapes );

        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when 
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials =
          { phong: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ) ),

            abstract: context.get_instance(Texture_Rotate).material( Color.of( 0, 0, 0,1 ), 
                             { ambient: 1, texture: context.get_instance( "assets/pattern.gif", false ) } ),
            retro: context.get_instance(Texture_Scroll_X).material( Color.of( 0, 0, 0,1 ), 
                             { ambient: 1, texture: context.get_instance( "assets/retro.png", true ) } )
          }

        this.lights = [ new Light( Vec.of( -5,5,5,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

        // TODO:  Create any variables that needs to be remembered from frame to frame, such as for incremental movements over time.
        let rotate_on = false;
        this.box_transform = Mat4.identity().times(Mat4.translation([-2, 0, 0]));
        this.box_2_transform = Mat4.identity().times(Mat4.translation([2, 0, 0]));


      }
    make_control_panel()
      { // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
        //this.key_triggered_button( "Change Colors", [ "c" ], this.set_colors );
        this.key_triggered_button( "Rotation",       [ "c" ], () => {

    if (this.rotate_on == false)
          {
            this.rotate_on = true;
          }
          else
          this.rotate_on = false;
        
          } );
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        
        if (this.rotate_on)
        {

            this.box_transform = this.box_transform.times(Mat4.rotation(dt*3, Vec.of(1, 0, 0)));

            this.box_2_transform = this.box_2_transform.times(Mat4.rotation(dt*2, Vec.of(0, 1, 0)));
            
        }

            this.shapes.box.draw( graphics_state, this.box_transform, this.materials.abstract );

            this.shapes.box_2.draw( graphics_state, this.box_2_transform, this.materials.retro );
       
        
      }
  }

class Texture_Scroll_X extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          
          float time = mod(animation_time, 2.0);
          float delta_x = time*2.0;

          mat4 translate1;
          translate1[0] = vec4(1.0, 0.0, 0.0, 0.0);
          translate1[1] = vec4(0.0, 1.0, 0.0, 0.0);
          translate1[2] = vec4(0.0, 0.0, 1.0, 0.0);
          translate1[3] = vec4(delta_x, 0, 0.0, 1.0);
		
          vec4 texcoord = vec4(f_tex_coord, 0, 1);
          vec4 texcoord2 = translate1*texcoord;
          vec4 tex_color = texture2D( texture, texcoord2.xy );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:

           
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}

class Texture_Rotate extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.


          
          float time = mod(animation_time, 4.0);
          float delta_x = 2.0*3.14159*0.25*time;

          mat4 translate1;
          translate1[0] = vec4(1.0, 0.0, 0.0, 0.0);
          translate1[1] = vec4(0.0, 1.0, 0.0, 0.0);
          translate1[2] = vec4(0.0, 0.0, 1.0, 0.0);
          translate1[3] = vec4(-0.5, -0.5, 0.0, 1.0);

           mat4 translate2;
          translate2[0] = vec4(1.0, 0.0, 0.0, 0.0);
          translate2[1] = vec4(0.0, 1.0, 0.0, 0.0);
          translate2[2] = vec4(0.0, 0.0, 1.0, 0.0);
          translate2[3] = vec4(0.5, 0.5, 0.0, 1.0);

          mat4 r;
          r[0] = vec4(cos(delta_x), sin(delta_x), 0.0, 0.0);
          r[1] = vec4(-sin(delta_x), cos(delta_x), 0.0, 0.0);
          r[2] = vec4(0.0, 0.0, 1.0, 0.0);
          r[3] = vec4(0.0, 0.0, 0.0, 1.0);
		

          vec4 texcoord = vec4(f_tex_coord, 0, 1);
          vec4 texcoord2 = translate2*r*translate1*texcoord;
          vec4 tex_color = texture2D( texture, texcoord2.xy );                       // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}