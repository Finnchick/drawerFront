export interface CameraOptions {
    distance: number,
    startingPosition: [number, number],
    fieldOfView: number, //checknut' che eto za hueta
    viewPort: ViewPort,
    scaleX: number,
    scaleY: number,
}

interface ViewPort {
    top: number,
    left: number,
    right: number,
    bottom: number,
    width: number,
    height: number,
    scale: [number, number]
}

export default class Camera {
    private distance: number;
    private startingPosition: [number, number];
    private context: CanvasRenderingContext2D;
    private viewPort: ViewPort;
    private fieldOfView: number;
    private aspectRatio: number;
    constructor(context: CanvasRenderingContext2D, options?: CameraOptions) {
        this.distance = options?.distance || 1000.0;
        this.startingPosition = options?.startingPosition || [0, 0];
        this.context = context;
        this.fieldOfView = options?.fieldOfView || Math.PI / 4.0;
        this.viewPort = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [options?.scaleX || 0, options?.scaleY || 0]
        };
        //debugger
        this.init()
    }

    init() {
        this.addListeners();
        this.updateViewport();
    }

    begin() {
        this.context.save();
        this.applyTranslation();
        this.applyScale();
    }

    end() {
        this.context.restore();
    }

    applyScale() {
        this.context.scale(this.viewPort.scale[0], this.viewPort.scale[1]);
    }

    drawCameraBorders() {
        // this.context.beginPath()
        // this.context.strokeStyle = 'black';
        // this.context.lineWidth = 5;
        // this.context.lineCap = 'round';
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
        this.context.beginPath();
        this.context.fillStyle = 'black'
        // this.context.fillRect(250,250,250,250);
        // this.context.rect(250,250,250,250);
        this.context.rect(this.viewPort.left, this.viewPort.top, this.viewPort.right - this.viewPort.left, this.viewPort.bottom - this.viewPort.top);
        this.context.closePath();
         this.context.stroke()
        // this.context.moveTo(this.viewPort.left, this.viewPort.top);
        // this.context.lineTo(this.viewPort.right, this.viewPort.top);
        // this.context.lineTo(this.viewPort.right, this.viewPort.bottom);
        // this.context.lineTo(this.viewPort.left, this.viewPort.bottom);
        // debugger
        // this.context.lineTo(this.viewPort.left, this.viewPort.top);
        // this.context.stroke();
    }

    applyTranslation() {
        this.context.translate(-this.viewPort.left, -this.viewPort.top); //pochemu tak?
    }

    updateViewport() {
        this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
        this.viewPort.width = this.distance / Math.tan(this.fieldOfView);
        this.viewPort.height = this.viewPort.width / this.aspectRatio;
        this.viewPort.left = this.startingPosition[0] - (this.viewPort.width / 2);//Polnay hueta, kazhetsy nado menyat' na pole
        this.viewPort.top = this.startingPosition[1] - (this.viewPort.height / 2);
        this.viewPort.right = this.viewPort.left + this.viewPort.width;
        this.viewPort.bottom = this.viewPort.top + this.viewPort.height;
        this.viewPort.scale[0] = this.context.canvas.width / this.viewPort.width;
        this.viewPort.scale[1] = this.context.canvas.height / this.viewPort.height;
        this.drawCameraBorders()
    }

    addListeners() {
        window.onwheel = (e:WheelEvent) => {
            debugger
            if (e.ctrlKey) {
                debugger
                let zoomLevel = this.distance - (e.deltaY * 20)
                if (zoomLevel <= 1) {
                    zoomLevel = 1;
                }

                this.zoomTo(zoomLevel);

            } else {
                    const x = this.startingPosition[0] + (e.deltaX * 2);
                    const y = this.startingPosition[1] + (e.deltaY * 2);

                    this.moveTo(x, y);
                }
            }

        window.addEventListener('keydown', (e:KeyboardEvent) => {

            if (e.ctrlKey) {

                let zoomLevel = this.distance;

                if (e.key === 'q') {
                     zoomLevel = this.distance - 10;
                    if (zoomLevel <= 1) {
                        zoomLevel = 1;
                    }

                } else if (e.key === 'y') {
                    zoomLevel = this.distance + 10;
                }
                this.zoomTo(zoomLevel);
            }

        })

            window.addEventListener('keydown', (e:KeyboardEvent) => {
                if (e.key === 'r') {
                    this.zoomTo(1000);
                    this.moveTo(0, 0);
                    debugger
                }
        })

            window.addEventListener('keydown', (e:KeyboardEvent) => {
                if (e.key === 'ArrowLeft') {
                    const x = this.startingPosition[0] - 10;
                    const y = this.startingPosition[1];
                    this.moveTo(x, y);
                } else if (e.key === 'ArrowRight') {
                    const x = this.startingPosition[0] + 10;
                    const y = this.startingPosition[1];
                    this.moveTo(x, y);
                } else if (e.key === 'ArrowUp') {
                    const x = this.startingPosition[0];
                    const y = this.startingPosition[1] - 10;
                    this.moveTo(x, y);
                } else if (e.key === 'ArrowDown') {
                    const x = this.startingPosition[0];
                    const y = this.startingPosition[1] + 10;
                    this.moveTo(x, y);
                }
            })
        }


    zoomTo(distance:number) {
        this.distance = distance;
        this.updateViewport();
    }

    moveTo(x:number, y:number) {
        this.startingPosition[0] = x;
        this.startingPosition[1] = y;
        this.updateViewport();
    }

    screenToWorld(x:number, y:number) {
        const obj = {x, y}
        obj.x = (x / this.viewPort.scale[0]) + this.viewPort.left; //pochemu tak?
        obj.y = (y / this.viewPort.scale[1]) + this.viewPort.top;
        return obj;
    }

    worldToScreen(x:number, y:number) {
        const obj = {x, y}
        obj.x = (x / this.viewPort.scale[0]) + this.viewPort.left; //pochemu tak?
        obj.y = (y / this.viewPort.scale[1]) + this.viewPort.top;
        return obj;
    }
}