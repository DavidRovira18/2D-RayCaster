class EditorMode{
    constructor(collidables)
    {
        this.editor_button =  document.getElementById("editor");
        this.active = false;
        this.collidables = collidables;
        this.selectedLine = null;

        this.create_collidable_button = document.getElementById("create_collidable");
        this.creatingCollidable = false;
        this.startPoint = null;
        this.endPoint = null;

        this.help_button = document.getElementById("help");
        this.help_close_button = document.getElementById("close_help");
        this.help_div = document.getElementById("help_div")
        this.show_help = false;
    }

    activate(){
        this.active = !this.active;
        if (this.active)
        {
            this.editor_button.innerText = "Exit Editor Mode"
            this.create_collidable_button.style.visibility = "visible";
            this.help_button.style.visibility = "visible";
        }
            
        else
        {
            this.editor_button.innerText = "Enter Editor Mode"
            this.create_collidable_button.style.visibility = "hidden";
            this.help_button.style.visibility = "hidden";
            this.startPoint = null;
            this.creatingCollidable = false;
            this.create_collidable_button.innerText = "Create new collidables"
        }

    }

    creatingCollidableActivate()
    {
        this.creatingCollidable = !this.creatingCollidable
        if (this.creatingCollidable)
            this.create_collidable_button.innerText = "You are now creating new collidables";

        else
            this.create_collidable_button.innerText = "Create new collidables"

    }

    showHelp()
    {
        this.show_help = !this.show_help;
        if(this.show_help)
        {
            this.help_div.style.visibility = "visible";
            this.editor_button.disabled = true;
            this.create_collidable_button.disabled = true;
        }

        else
        {
            this.help_div.style.visibility = "hidden";
            this.editor_button.disabled = false;
            this.create_collidable_button.disabled = false;
        }

    }

    draw(ctx)
    {
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for(var collidable of collidables)
            collidable.render(ctx);

        ctx.fillStyle = "green";
        if(this.startPoint)
        {
            ctx.beginPath();
            ctx.arc(this.startPoint.x, this.startPoint.y, 5, 0, 2 * Math.PI, true);
            ctx.fill();
        }

        ctx.fillStyle = "black";

    }

    hitTesting(x, y, x1, y1, x2, y2, threshold = 5){ //Check if point is close to line
        const dist = Math.hypot(x - x1, y - y1) + Math.hypot(x - x2, y - y2);
        const lineLen = Math.hypot(x1 - x2, y1 - y2);
        return dist <= lineLen + threshold;
    }

    onClickEditor(event)
    {
        event.preventDefault();
        if (event.button == 0) 
            this.onLeftClickEditor(event);
        if (event.button == 2)
            this.onRightClickEditor(event);
    }

    onLeftClickEditor(event)
    {
        if (!this.active) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if(this.creatingCollidable)
        {
            if(!this.startPoint)
            {
                this.startPoint = new vec2(mouseX, mouseY);
            }

            else{
                this.endPoint = new vec2(mouseX, mouseY);
                this.collidables.push(new CollidableEntity(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y));
                this.startPoint = null;
                this.endPoint = null;
            }
        }
        
        else
        {
            for (const line of this.collidables) {
                const { startX, startY, endX, endY, a, b, isWall } = line;
                if (this.hitTesting(mouseX, mouseY, startX, startY, endX, endY) && !isWall) {
                    console.log("Clicked on a line! :)");
                    line.selected = true;
                    this.selectedLine = line;
                    return; 
                }
    
                else
                {
                    line.selected = false;
                    this.selectedLine = null;
                }
            }
    
            console.log("Clicked, but not on any line. :(");
        }
        
    }

    onRightClickEditor() {
        if (this.selectedLine) {
            const index = this.collidables.indexOf(this.selectedLine);
            if (index !== -1) {
                this.collidables.splice(index, 1); // Remove selected line
                this.selectedLine = null; // Clear selected line
            }
        }
    }
}


