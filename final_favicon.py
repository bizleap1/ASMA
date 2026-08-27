from PIL import Image, ImageChops

def process():
    img = Image.open('public/logo.png').convert('RGBA')
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Make dark pixels pure black
        if item[0] < 80 and item[1] < 80 and item[2] < 80:
            new_data.append((0, 0, 0, item[3]))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Find bounding box
    bg = Image.new('RGB', img.size, (255, 255, 255))
    diff = ImageChops.difference(img.convert('RGB'), bg)
    bbox = diff.getbbox()
    
    if bbox:
        img = img.crop(bbox)
        
    # Create a solid white background of the cropped size
    final_img = Image.new('RGB', img.size, (255, 255, 255))
    # Paste the image on the white background
    final_img.paste(img, (0, 0), img)
    
    # Save it
    final_img.save('public/favicon.png', 'PNG')

if __name__ == '__main__':
    process()
