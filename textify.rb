# encoding: UTF-8

require 'RMagick'
require 'optparse'

#
# Useful character sets
#

CHARSETS = {
  # From "Character representation of grayscale images" by Paul Bourke
  # http://paulbourke.net/dataformats/asciiart/
  'bourke' => %q[@%#*+=-:. ],

  # Unicode block, shades, and space.
  'shades' => %q[█▓▒░ ],

  # From "Grayscale Ascii From Bitmap" by Raj Kaimal
  # http://weblogs.asp.net/rajbk/archive/2004/07/31/202764.aspx
  'kaimal' => %q[M#E8Oo+i=I;:~.` ],

  # From "img2txt" by 王超 https://github.com/hit9/img2txt
  'hit9' => %q[MNHQ$OC?7>!:-;. ],

  # From "Character representation of grayscale images" by Paul Bourke
  # http://paulbourke.net/dataformats/asciiart/
  'standard' => %q[$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'. ]
}

#
# Option parsing
#

OPTION_FLAGS = {
  width: ['-w', '--width [WIDTH]', Integer, "Number of characters to use for the image width"],
  chars: ['-c', '--chars [CHARS]', "Characters to use"],
  charset: ['-s', '--charset [CHARSET]', CHARSETS.keys, "Use a predefined character set"],
}

options = {
  charset: 'shades'
}

opts_parser = OptionParser.new do |opts|
  opts.banner = "Usage: textify.rb gif_path [options]"
  OPTION_FLAGS.each do |arg, vals|
    opts.on(*vals) do |parsed_input|
      options[arg] = parsed_input
    end
  end
  opts.on_tail("-l", "--list-charsets", "List predefined character sets") do
       puts "The following character have been collected from the interwebs for your using pleasure."
       puts "Just supply the character set using the `--charset` flag:"
       puts "    ruby textify.rb gif_path --charset shades"
       puts "See CHARSETS in textify.rb for credits."
    CHARSETS.each do |name, chars|
       puts "  #{name.ljust(10)} #{chars}"
    end
    exit
  end
  opts.on_tail("-h", "--help", "Show this message") do
    puts opts
    exit
  end
end

if ARGV.empty?
  puts opts_parser.banner
  puts opts_parser.summarize
  exit
end

#
# Set the arguments
#

opts_parser.parse!
gif_path = ARGV[0]
gif_path || raise(ArgumentError, "Please provide a gif path")
resize_width = options[:width]
charset = options[:chars] || CHARSETS[options[:charset]]
charset_size = charset.size

#
# Convert the images
#

images = Magick::ImageList.new(gif_path)
gif_delay = images.delay * images.ticks_per_second / 10
textified_frames = images.to_a.map { |image|
  image.resize_to_fit!(resize_width) if resize_width
  height = image.rows
  width = image.columns
  bw_image = image.quantize(256, Magick::GRAYColorspace)
  gray_values = bw_image.get_pixels(0, 0, width, height).map{|x|
    x.to_hsla.last == 0.0 ? 65535 : x.red
  }
  stringified = ""

  gray_values.each_with_index do |val, i|
    # Convert the pixel
    stringified << charset[(charset_size * val.to_f / 256 ** 2).to_i]
    # Add a linebreak at the end of each row
    stringified << '\n' if i % width == width - 1
  end
  # Escape any double quotes
  '"' << stringified.gsub(/"/, '\"') << '"'
}

#
# Write the data
#

File.open('gif-data.js', 'w') do |f|
  f <<  'window.GIF={' <<
          'frames:' << '[' << textified_frames.join(',') << '],' <<
          'delay:'  << gif_delay <<
        '};'
end

