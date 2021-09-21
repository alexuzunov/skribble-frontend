import React, { useState } from 'react'
import './Drawing.css'
import { Color } from './Color'
import { useParams } from 'react-router'

const Drawing = () => {
    let { id } = useParams<{id: string}>()
    const [penCoordinates, setPenCoordinates] = useState([] as number[])
    const [penColor, setPenColor] = useState('rgba(0, 0, 0, 255)') 
    const [lineWidth, setLineWidth] = useState(10)
    const [pen, setPen] = useState('none')
    const [mode, setMode] = useState('draw')

    const draw = () => {
        setMode('draw')
    }

    const fill = () => {
        setMode('fill')
    }

    const erase = () => {
        setMode('erase')
    }

    const drawing = (event: React.MouseEvent<HTMLElement>) => {
        if (pen === 'down') {
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            let canvasContext = canvas.getContext('2d')
            if (canvasContext) {
                canvasContext.beginPath()
                canvasContext.lineWidth = lineWidth
                canvasContext.lineCap = 'round';


                if (mode === 'draw') {
                    canvasContext.strokeStyle = penColor
                }

                if (mode === 'erase') {
                    canvasContext.strokeStyle = '#ffffff'
                }

                canvasContext.moveTo(penCoordinates[0], penCoordinates[1]) 
                canvasContext.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY) 
                canvasContext.stroke()

                setPenCoordinates([event.nativeEvent.offsetX, event.nativeEvent.offsetY])
                console.log(canvasContext.getImageData(0, 0, canvas.width, canvas.height))
            }
        }
    }

    const penDown = (event: React.MouseEvent<HTMLElement>) => { 
        setPen('down')
        setPenCoordinates([event.nativeEvent.offsetX, event.nativeEvent.offsetY])
        if (mode === 'fill') {
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            let canvasContext = canvas.getContext('2d')
            if (canvasContext) {
                const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height)
                const color = rgbaParser(penColor)
                const rect = canvas.getBoundingClientRect()
                const x = Math.round(event.clientX - rect.left)
                const y = Math.round(event.clientY - rect.top)
                filling(imageData, color, x, y)
                canvasContext.putImageData(imageData, 0, 0)
            }
        }
    }

    const penUp = () => {
        setPen('up')
    }

    const penSizeUp = () => {
        setLineWidth(lineWidth + 5)
    }

    const penSizeDown = () => {
        setLineWidth(lineWidth - 5)
    }

    const setColor = (color: string) => { 
        setPenColor(color);
    }

    const reset = () => {
        setMode('draw')
        setPen('up')
        setLineWidth(10)
        setPenColor('black') 
        
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let canvasContext = canvas.getContext('2d')
        if (canvasContext) {
            canvasContext.fillStyle = "white"
            canvasContext.fillRect(0, 0, 800, 600)
            canvasContext.lineWidth = 10
        }
    }

    const rgbaParser = (rgba: string) => {
        const sliced = rgba.slice(5, rgba.length - 1)
        const values = sliced.split(", ")

        return {
            r: Number(values[0]),
            g: Number(values[1]),
            b: Number(values[2]),
            a: Number(values[3])
        }
    }

    const getColorAtPixel = (imageData: ImageData, x: number, y: number) => {
        const {width, data} = imageData
      
        return {
          r: data[4 * (width * y + x) + 0],
          g: data[4 * (width * y + x) + 1],
          b: data[4 * (width * y + x) + 2],
          a: data[4 * (width * y + x) + 3]
        }
    }

    const setColorAtPixel = (imageData: ImageData, color: Color, x: number, y: number) => {
        const {width, data} = imageData
      
        data[4 * (width * y + x) + 0] = color.r & 0xff
        data[4 * (width * y + x) + 1] = color.g & 0xff
        data[4 * (width * y + x) + 2] = color.b & 0xff
        data[4 * (width * y + x) + 3] = color.a & 0xff
    }

    const colorMatch = (a: Color, b: Color) => {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
    }


    const filling = (imageData: ImageData, newColor: Color, x: number, y: number) => {
        const {width, height} = imageData
        const stack = []
        const baseColor = getColorAtPixel(imageData, x, y)
        let operator = {x, y}

// Check if base color and new color are the same
        if (colorMatch(baseColor, newColor)) {
            return
        }

// Add the clicked location to stack
        stack.push({x: operator.x, y: operator.y})

        while (stack.length) {
            operator = stack.pop()!
            let contiguousDown = true // Vertical is assumed to be true
            let contiguousUp = true // Vertical is assumed to be true
            let contiguousLeft = false
            let contiguousRight = false

        // Move to top most contiguousDown pixel
            while (contiguousUp && operator.y >= 0) {
                operator.y--
                contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor)
            }

        // Move downward
            while (contiguousDown && operator.y < height) {
                setColorAtPixel(imageData, newColor, operator.x, operator.y)

                // Check left
                if (operator.x - 1 >= 0 && colorMatch(getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
                    if (!contiguousLeft) {
                        contiguousLeft = true
                        stack.push({x: operator.x - 1, y: operator.y})
                    }
                } else {
                    contiguousLeft = false
                }

                // Check right
                if (operator.x + 1 < width && colorMatch(getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
                    if (!contiguousRight) {
                        stack.push({x: operator.x + 1, y: operator.y})
                        contiguousRight = true
                    }
                } else {
                    contiguousRight = false
                }

                operator.y++
                contiguousDown = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor)
            }
        }
    }

    return (
        <div id="mainDiv">
            <canvas id="canvas" width="800px" height="600px" 
                onMouseMove={(e) => drawing(e)} 
                onMouseDown={(e) => penDown(e)} 
                onMouseUp={() => penUp()}>
            </canvas>
            <div>
                <button onClick={() => draw()}>Draw</button>
                <button onClick={() => fill()}>Fill</button>
                <button onClick={() => erase()}>Erase</button>
                <button onClick={() => penSizeUp()}>Pen Size +</button>
                <button onClick={() => penSizeDown()}>Pen Size -</button>
                <button onClick={() => reset()}>Reset</button>
            </div>
            <div>
                <button style={{'backgroundColor': 'rgba(255, 0, 0, 255)'}} onClick={() => setColor('rgba(255, 0, 0, 255)')}>Red</button>
                <button style={{'backgroundColor': 'rgba(248, 148, 6, 255)'}} onClick={() => setColor('rgba(248, 148, 6, 255)')}>Orange</button>
                <button style={{'backgroundColor': 'rgba(240, 255, 0, 255)'}} onClick={() => setColor('rgba(240, 255, 0, 255)')}>Yellow</button>
                <button style={{'backgroundColor': 'rgba(0, 255, 0, 255)'}} onClick={() => setColor('rgba(0, 255, 0, 255)')}>Green</button>
                <button style={{'backgroundColor': 'rgba(0, 0, 255, 255)'}} onClick={() => setColor('rgba(0, 0, 255, 255)')}>Blue</button>
                <button style={{'backgroundColor': 'rgba(154, 18, 179, 255)'}} onClick={() => setColor('rgba(154, 18, 179, 255)')}>Purple</button>
                <button style={{'backgroundColor': 'rgba(0, 0, 0, 255)', 'color': 'white'}} onClick={() => setColor('rgba(0, 0, 0, 255)')}>Black</button>
            </div>
        </div>
    )
}

export default Drawing;