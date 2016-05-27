# Corrdinates in the GPU

<!-- MarkdownTOC depth=0 autolink=true -->

- [Clip Space](#clip-space)
  - [Viewport](#viewport)
- [Flipped Y axis](#flipped-y-axis)

<!-- /MarkdownTOC -->


As I try to wrap my head around wirtting WebGL applications, the coordinate system was something that threw me off.
This is a description of what I understand.
If you find any mistakes, please let me know, I will greatly appreciate it. 

## Clip Space
```
          1                       -1,1 _____ 1,1
          |                           |\    |
          |                           | \   |
 -1---------------1        or         |  \  |
          |                           |   \ |
          |                           |____\|
         -1                       -1,-1      1,-1
```
Clip space ranges from -1 to 1 values, regardless of the canvas size. GPU thinks of coordinates in this way.

Let's say the viewport is 300px wide, here is how it translates:
```
Screen                             Clip space
0 ------------------ 300px   =    -1 ------------------ 1
     150px --------- 300px   =              0 --------- 1
  50px ------------- 300px   =      -0.66 ------------- 1
 5px ----------- 250px       =    -0.96 ----------- 0.66
```
To do this translation from screen to clip space coordinates, the math can be simply:
```javascript 
clipSpaceCoordinate = ((valueInPixels / totalInPixels) * 2) - 1;
```
See [WebGL Fundamentals](http://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html)

What this is doing:  
It converts the point from pixels to 0.0 -> 1.0:  
`var x = valueInPixels / totalInPixels`

Then it needs to move the point from 0.0 -> 1.0 to 0.0 -> 2.0:  
`x *= 2`  

And lastly shift it once more so it is actually what we need by moving from 0.0 -> 2.0 to -1 -> 1:  
`x -= 1`

So the values above are translated like this:
```
          px                    clip space
          ^                     ^
          |                     |
var x = ((0   / 300) * 2) - 1 = -1
var x = ((300 / 300) * 2) - 1 = 1
var x = ((150 / 300) * 2) - 1 = 0
var x = ((50  / 300) * 2) - 1 = -0.6666666666666667
```
And so on...

### Viewport
How does the GPU know the actual size of the screen?
We have screens with different resolutions, sizes and what not.
So we need to tell the GPU the dimensions in pixels where it will paint.

eg: `gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);`

A typical way of starting a canvas with a WebGL context will be something like this:

```javascript
var canvas = document.createElement('canvas');
var gl = canvas.getContext('webgl');
```
Just like that, the `gl` variable will be the one that will let us "talk" to the GPU. And it makes a guess as to what the viewport dimensions are.
At this point it asssumes the viewport is exactly the same size as the canvas.

If I continue with my typical program, I would perhaps define the size of my canvas:

```javascript
var canvas = document.createElement('canvas');
var gl = canvas.getContext('webgl');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
```
***(This was confusing to me at first for some reason)***
Now my canvas fills the screen, but if I start painting things using the `gl` context, everything will fill just a small portion of the screen.

That is because when we created the context, the canvas was set to 300px x 150px. Therefore the viewport was defined to these dimensions.
Then the size of the canvas changed, but that does not automatically change the gl viewport.

So if instead I write it like this (Naive solution)
```javascript
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = canvas.getContext('webgl');
```
By the time the gl context is created, the size of the canvas is the size of the screen, then the viewport will have those dimenions.

But the way to have control over it is to define the viewport as we want it, when we want to.

```javascript
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
```

Those weird `gl.drawingBufferWidth` and `gl.drawingBufferHeight` are quite useful. They are the width and height of the canvas where the context exists. (Or so it seems in all my use cases).

## Flipped Y axis
The Y axis is "inverted" in comparison to other coordinate systems (eg: Canvas element in HTML).
This needs to be accounted for when applying transformations.

What makes most sense to me right now is to flip things vertically on a base matrix.
