# Textify

Give your animated GIFs some <del>ASCII</del> Unicode art lovin'.

## Requirements

 - Ruby 1.9.3+ (Unicode support, FTW)
 - ImageMagick
 - RMagick

Note there's no Gemfile, so you'll need to install RMagick on your own:

    gem install rmagick

## How

Simply run the following:

    ruby textify.rb gif_path [options...]

And then open the provided `viewer.html` to see your textified GIF animation.

See `ruby textify.rb --help` for more details.

## The Magic Inside

The script creates a `gif-data.js` file that will contain a global JavaScript
object `GIF` that contains the converted data. `GIF` has two properties:

 - `frames`: a string array of the converted frames
 - `delay`: the number milliseconds between each frame of the original animation

`viewer.html` loads this file along with the following:

 - `animation-shim.js`: A simple shim for [`requestAnimationFrame`][reqanim-docs].
 - `text-animation.js`: A lovely class for creating text animations.

And then runs the animation using the `TextAnimation` class.

See `text-animation.js` for more information about configuring the animation.

## Some Suggestions

 - Toy with different character sets; keep in mind that the goal is to replicate
   shades of gray.
 - Larger character sets aren't always better.
 - Adjust the CSS as necessary.
 - Toy with different widths.
 - Noisy GIFs don't look to hot.
 - Some poorly created GIFs have frames of varying sizes, so the animation's
   behavior might feel a bit erratic.

## Coming Soon (Perhaps)
 
 - Add some Class
 - Multithreading
 - Static image conversion
 - Add more character sets
 - GitHub page
 - Terminal magic via `curses`/`ncurses`
 - Testing 

 [reqanim-docs]: https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame "window.requestAnimationFrame()"

## License

Copyright (c) 2014 Faraz Yashar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.