from PIL import Image

def process_image():
    img = Image.open('public/logo.png')
    img = img.convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Make white-ish pixels transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        # Make dark pixels white
        elif item[0] < 80 and item[1] < 80 and item[2] < 80:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save('public/favicon-transparent.png', 'PNG')

if __name__ == '__main__':
    process_image()
