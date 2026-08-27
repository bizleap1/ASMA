from PIL import Image, ImageChops

def enlarge_raw():
    img = Image.open('public/logo.png').convert('RGB')
    # create a white background image to find difference
    bg = Image.new('RGB', img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    
    if bbox:
        # Open original to keep it completely raw
        original = Image.open('public/logo.png')
        cropped = original.crop(bbox)
        cropped.save('public/favicon.png', 'PNG')

if __name__ == '__main__':
    enlarge_raw()
