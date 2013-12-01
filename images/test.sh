#!/bin/bash
#make a temp folder
mkdir tmp
 
#rotate example-arrow.png across the horizon in 15-degree increments with convert
for i in {0..180..15}
do
convert -rotate $i IsoCubes_01.png tmp/$(printf %03d $i).png
echo rotated $i degrees
done
 
#make a sprite (a vertical strip) containing all 13 images with montage
montage -tile 1x13  tmp/*.png sprite.png
 
#delete the arrows that were shoved into the sprite
rm -rf  tmp