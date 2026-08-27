from PIL import Image
import shutil
import os

if not os.path.exists('public/logo-original.png'):
    shutil.copy('public/logo.png', 'public/logo-original.png')

def process_image():
    img = Image.open('public/logo-original.png')
    img = img.convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Make white-ish pixels transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save('public/logo.png', 'PNG')

if __name__ == '__main__':
    process_image()
