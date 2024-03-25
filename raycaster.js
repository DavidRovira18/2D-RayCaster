const canvas = document.getElementById("raycaster");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collidables = new Array();
//Add the walls as collidables
collidables.push(new CollidableEntity(0, 0, canvas.width, 0, true));
collidables.push(new CollidableEntity(canvas.width, 0, canvas.width, canvas.height, true));
collidables.push(new CollidableEntity(canvas.width, canvas.height, 0, canvas.height, true));
collidables.push(new CollidableEntity(0, canvas.height, 0, 0, true));

//Toggle editor mode
const editorMode = new EditorMode(collidables);
editorMode.editor_button.addEventListener("click", function(){editorMode.activate();});
editorMode.create_collidable_button.addEventListener("click", function(){editorMode.creatingCollidableActivate();});
editorMode.help_button.addEventListener("click", function(){editorMode.showHelp();});
editorMode.help_close_button.addEventListener("click", function(){editorMode.showHelp();})

const draw_collision = true;

ctx.fillStyle = "black";

const emit1 = new EmitEntity(canvas.width/2, canvas.height/2, 500);
function draw(ctx)
{
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var collidable of collidables)
        collidable.render(ctx);

    emit1.render(ctx);
    


    // var col_pt = ray.rayWallCollision(collidable);
    // if(col_pt)
    // {
    //     if(!draw_collision)
    //         return;

    //     ctx.beginPath();
    //     ctx.fillStyle = "#FFFFFF";
    //     ctx.arc(col_pt.x, col_pt.y, 5, 0, 2 * Math.PI);
    //     ctx.fill();

    //     //RETURN FILL STYLE TO PREVIOUS STATE
    //     ctx.fillStyle = "black";

    // }
}

function loop()
{
    if(!editorMode.active)
    {
        draw(ctx);
        emit1.update(ctx,collidables);
    }

    else
    {
        editorMode.draw(ctx);
    }
    requestAnimationFrame(loop);
}

//Update
canvas.addEventListener("contextmenu", function(event) {event.preventDefault();});
document.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", editorMode.onClickEditor.bind(editorMode));

function onMouseMove(event)
{
    for(var ray of emit1.rays)
        ray.setPos(event.clientX, event.clientY);
}

loop();