from PIL import Image

def main():
    b1 = Image.open('assets/images/bono1-planificador.png').convert("RGBA")
    b2 = Image.open('assets/images/bono2-jugos-detox.png').convert("RGBA")
    b3 = Image.open('assets/images/bono3-sin-tacc.png').convert("RGBA")
    b4 = Image.open('assets/images/bono4-sin-harinas.png').convert("RGBA")
    b5 = Image.open('assets/images/bono5-postres.png').convert("RGBA")

    # Resize all to have a similar height
    base_h = 400
    def rescale(img):
        w_percent = (base_h / float(img.size[1]))
        w_size = int((float(img.size[0]) * float(w_percent)))
        return img.resize((w_size, base_h), Image.Resampling.LANCZOS)
    
    b1 = rescale(b1)
    b2 = rescale(b2)
    b3 = rescale(b3)
    b4 = rescale(b4)
    b5 = rescale(b5)

    canvas_w = 900
    canvas_h = 600
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

    # Fan out layout: Back to Front
    # Back-left
    b1_rot = b1.rotate(15, expand=True)
    canvas.paste(b1_rot, (50, 100), b1_rot)
    # Back-right
    b5_rot = b5.rotate(-15, expand=True)
    canvas.paste(b5_rot, (500, 100), b5_rot)
    # Mid-left
    b2_rot = b2.rotate(8, expand=True)
    canvas.paste(b2_rot, (150, 60), b2_rot)
    # Mid-right
    b4_rot = b4.rotate(-8, expand=True)
    canvas.paste(b4_rot, (400, 60), b4_rot)
    # Front-center
    b3_rot = b3.rotate(0, expand=True)
    canvas.paste(b3_rot, (300, 20), b3_rot)

    canvas.save('assets/images/bonos-bundle.png')

if __name__ == '__main__':
    main()
