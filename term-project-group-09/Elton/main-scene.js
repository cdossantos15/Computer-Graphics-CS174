window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0,0,-10), Vec.of(0,0,0), Vec.of(0,1,0));

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 10000 );
        context.globals.graphics_state.view_transform = Mat4.inverse(context.globals.graphics_state.camera_transform).times(Vec.of(0,0,0,1));
 
        const shapes = { cubemap: new Cube(),
                         person: new Rock()
                       }
      
        this.submit_shapes( context, shapes );


 ////////////////////MATERIALS THAT SET THE CUBEMAP FLAG TO TRUE
        this.materials =
          { 

          reflected_object: context.get_instance( Reflecting_Object ).material( Color.of(0, 0,0, 1), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/star.png", true, true) } ),

          cubemap_env: context.get_instance( Cubemap ).material( Color.of(0, 0,0, 1), {ambient: 1, texture: context.get_instance("assets/rock.png",true, true) } ),
       }

        this.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of( 0,1,1,1 ), 1000000000 ) ];

        // TODO:  Create any variables that needs to be remembered from frame to frame, such as for incremental movements over time.
       
      }
    make_control_panel()
      { // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
        
        
        this.result_img = this.control_panel.appendChild( Object.assign( document.createElement( "img" ), 
                { style:"width:200px; height:" + 200 * this.aspect_ratio + "px" } ) );
      }

      
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time, dt = graphics_state.animation_delta_time ;
        
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let model_transform1 = Mat4.identity();
        let model_transform2 = Mat4.identity();
         
            //THIS IS THE CUPEMAP SHAPE
      model_transform1 = model_transform1.times(Mat4.scale([30,30,30]));       
      this.shapes.cubemap.draw(graphics_state, model_transform1, this.materials.cubemap_env);

        
 
         //THIS IS WHAT GOES IN THE CUPEMAP
        model_transform2 = model_transform2.times(Mat4.scale([.3,.3,.3]).times(Mat4.translation([0,0,0])));
        this.shapes.person.draw(graphics_state, model_transform2, this.materials.reflected_object);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }
}


